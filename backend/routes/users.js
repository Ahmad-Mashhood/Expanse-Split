const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

router.use(authMiddleware);

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('groups', 'name description totalAmount');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { name, phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, bio },
      { new: true }
    );
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
