import express from 'express';
import Payment from '../models/Payment.js';
import Address from '../models/Address.js';

const router = express.Router();

router.get('/successful-users', async (req, res) => {
  try {
    // Fetch successful payments
    const successfulPayments = await Payment.find({ status: 'Completed' });

    // Match payments with addresses using `mobileNumber` or any other unique field
    const results = await Promise.all(
      successfulPayments.map(async (payment) => {
        const address = await Address.findOne({ mobileNumber: payment.mobileNumber });
        return {
          paymentId: payment._id,
          orderId: payment.orderId,
          amount: payment.amount,
          date: payment.date,
          address,
        };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin data', error });
  }
});

export default router;
