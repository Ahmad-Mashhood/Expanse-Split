const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getPayments,
  settlePayment,
  getPendingPayments
} = require('../controllers/paymentController');

router.use(authMiddleware);

router.get('/pending', getPendingPayments);
router.get('/:groupId', getPayments);
router.post('/:paymentId/settle', settlePayment);

module.exports = router;
