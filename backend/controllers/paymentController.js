const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

exports.getPayments = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    const payments = await Payment.find({
      group: groupId,
      $or: [{ from: userId }, { to: userId }]
    })
      .populate('from', 'name email profilePicture')
      .populate('to', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.settlePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.userId;

    const payment = await Payment.findById(paymentId);
    if (payment.from.toString() !== userId && payment.to.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'settled',
        settledAt: new Date()
      },
      { new: true }
    ).populate('from', 'name email')
      .populate('to', 'name email');

    // Create notification
    await Notification.create({
      user: payment.from,
      type: 'payment_settled',
      title: 'Payment Settled',
      message: `Payment of ${payment.amount} to ${updatedPayment.to.name} has been settled`,
      relatedId: paymentId
    });

    res.json({
      success: true,
      message: 'Payment settled successfully',
      payment: updatedPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    const userId = req.userId;

    const payments = await Payment.find({
      $or: [{ from: userId }, { to: userId }],
      status: 'pending'
    })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('group', 'name');

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
