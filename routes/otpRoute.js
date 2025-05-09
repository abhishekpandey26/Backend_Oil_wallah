import express from 'express';
import Payment from '../models/Payment.js';
import Address from '../models/Address.js';

const router = express.Router();

router.get('/successful-users', async (req, res) => {
  try {
    // Fetch all saved payments (you can filter by status if you've added that field)
    const successfulPayments = await Payment.find();

    const results = await Promise.all(
      successfulPayments.map(async (payment) => {
        // Ensure mobileNumber exists in payment
        const address = await Address.findOne({ mobileNumber: payment.mobileNumber });
        return {
          paymentId: payment._id,
          orderId: payment.razorpay_order_id,
          paymentIdRazorpay: payment.razorpay_payment_id,
          date: payment.createdAt, // assuming you have timestamps: true
          mobileNumber: payment.mobileNumber,
          address,
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: 'Error fetching admin data', error });
  }
});

export default router;
