const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Payment = require('../models/Payment');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, group, splitType, splits } = req.body;
    const userId = req.userId;

    const expense = await Expense.create({
      description,
      amount,
      category,
      paidBy: userId,
      group,
      splitType,
      splits
    });

    await Group.findByIdAndUpdate(group, {
      $push: { expenses: expense._id },
      $inc: { totalAmount: amount }
    });

    // Create payment records based on split type
    if (splitType === 'equal') {
      const groupData = await Group.findById(group);
      const memberCount = groupData.members.length;
      const splitAmount = amount / memberCount;

      for (let member of groupData.members) {
        if (member.toString() !== userId) {
          await Payment.create({
            from: member,
            to: userId,
            amount: splitAmount,
            group,
            status: 'pending'
          });
        }
      }
    } else if (splitType === 'custom') {
      for (let split of splits) {
        if (split.user.toString() !== userId) {
          await Payment.create({
            from: split.user,
            to: userId,
            amount: Number(split.amount),
            group,
            status: 'pending'
          });
        }
      }
    } else if (splitType === 'percentage') {
      for (let split of splits) {
        if (split.user.toString() !== userId) {
          const splitAmount = (amount * Number(split.percentage)) / 100;
          await Payment.create({
            from: split.user,
            to: userId,
            amount: splitAmount,
            group,
            status: 'pending'
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, category, splitType, splits } = req.body;
    const userId = req.userId;

    const expense = await Expense.findById(expenseId);
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only expense creator can update it'
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { description, amount, category, splitType, splits },
      { new: true }
    ).populate('paidBy', 'name email');

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.userId;

    const expense = await Expense.findById(expenseId);
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only expense creator can delete it'
      });
    }

    await Expense.findByIdAndDelete(expenseId);
    await Group.findByIdAndUpdate(expense.group, {
      $pull: { expenses: expenseId },
      $inc: { totalAmount: -expense.amount }
    });

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
