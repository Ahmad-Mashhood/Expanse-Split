const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.use(authMiddleware);

router.post('/', addExpense);
router.get('/:groupId', getExpenses);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;
