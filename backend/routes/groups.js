const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
  removeMember,
  deleteGroup,
  joinViaInvite,
  approveJoinRequest,
  rejectJoinRequest
} = require('../controllers/groupController');

router.use(authMiddleware);

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:groupId', getGroupById);
router.post('/:groupId/add-member', addMember);
router.post('/:groupId/remove-member', removeMember);
router.delete('/:groupId', deleteGroup);

// Invite and Request routes
router.post('/join/invite', joinViaInvite);
router.post('/:groupId/approve-request', approveJoinRequest);
router.post('/:groupId/reject-request', rejectJoinRequest);

module.exports = router;
