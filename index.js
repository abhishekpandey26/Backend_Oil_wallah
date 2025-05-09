import express from 'express';
import cors from 'cors';
import connectToMongo from './database/db.js';
import payment from './routes/payment.js';
import Address from './routes/AddressRoute.js';
import admin from './routes/admin.js';
import otpRoutes from './routes/otpRoute.js';
import Payment from './models/Payment.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set port from env or fallback to 5000
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Updated CORS configuration to allow requests from both production and development environments
app.use(cors({
  origin: ['https://oil-walla-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

// Connect to MongoDB
connectToMongo();

// Health check route
app.get('/', (req, res) => {
  res.send('OilWallah backend is running...');
});

// API routes
app.use('/api/payment', payment);
app.use('/api/address', Address);
app.use('/api/admin', admin);
app.use('/api/otp', otpRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong', 
    error: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});