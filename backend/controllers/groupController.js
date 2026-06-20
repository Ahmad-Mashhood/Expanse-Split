const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const userId = req.userId;

    // Resolve emails to user IDs if emails are provided
    let memberIds = [];
    if (members && members.length > 0) {
      // If the array contains objectIds (strings of length 24) or emails
      for (let member of members) {
        if (member.includes('@')) {
          const user = await User.findOne({ email: member });
          if (user) memberIds.push(user._id.toString());
        } else {
          memberIds.push(member);
        }
      }
    }

    // Filter out duplicates and include the creator
    const uniqueMemberIds = [...new Set([userId.toString(), ...memberIds])];

    // Generate random invite code
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const group = await Group.create({
      name,
      description,
      createdBy: userId,
      members: uniqueMemberIds,
      inviteCode
    });

    for (let memberId of uniqueMemberIds) {
      await User.findByIdAndUpdate(memberId, {
        $push: { groups: group._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await Group.find({ members: userId })
      .populate('members', 'name email profilePicture')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      groups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('members', 'name email profilePicture')
      .populate('createdBy', 'name email')
      .populate('joinRequests', 'name email profilePicture')
      .populate({
        path: 'expenses',
        populate: {
          path: 'paidBy',
          select: 'name email'
        }
      });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Backward compatibility: Generate invite code if group doesn't have one
    if (!group.inviteCode) {
      group.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      await group.save();
    }

    res.json({
      success: true,
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $push: { members: memberId } },
      { new: true }
    ).populate('members', 'name email profilePicture');

    await User.findByIdAndUpdate(memberId, {
      $push: { groups: groupId }
    });

    res.json({
      success: true,
      message: 'Member added successfully',
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: memberId } },
      { new: true }
    ).populate('members', 'name email profilePicture');

    await User.findByIdAndUpdate(memberId, {
      $pull: { groups: groupId }
    });

    res.json({
      success: true,
      message: 'Member removed successfully',
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    const group = await Group.findById(groupId);
    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only group creator can delete the group'
      });
    }

    await Group.findByIdAndDelete(groupId);
    await User.updateMany(
      { groups: groupId },
      { $pull: { groups: groupId } }
    );

    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.joinViaInvite = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.userId;

    const group = await Group.findOne({ inviteCode });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    if (group.joinRequests.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Join request already sent' });
    }

    group.joinRequests.push(userId);
    await group.save();

    res.json({
      success: true,
      message: 'Join request sent successfully to the group admin'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveJoinRequest = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToApprove } = req.body;
    const adminId = req.userId;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.createdBy.toString() !== adminId) {
      return res.status(403).json({ success: false, message: 'Only admin can approve requests' });
    }

    // Remove from join requests
    group.joinRequests = group.joinRequests.filter(id => id.toString() !== userIdToApprove);
    
    // Add to members
    if (!group.members.includes(userIdToApprove)) {
      group.members.push(userIdToApprove);
      await User.findByIdAndUpdate(userIdToApprove, { $push: { groups: group._id } });
    }

    await group.save();

    res.json({ success: true, message: 'User approved and added to group' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectJoinRequest = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToReject } = req.body;
    const adminId = req.userId;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.createdBy.toString() !== adminId) {
      return res.status(403).json({ success: false, message: 'Only admin can reject requests' });
    }

    // Remove from join requests
    group.joinRequests = group.joinRequests.filter(id => id.toString() !== userIdToReject);
    await group.save();

    res.json({ success: true, message: 'Join request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
