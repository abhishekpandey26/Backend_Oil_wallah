import express from 'express';
import cors from 'cors';
import connectToMongo from './database/db.js'; 
import payment from './routes/payment.js'; 
import Address from './routes/AddressRoute.js'; // Import Address routes
import admin from './routes/admin.js'; // Import admin routes
import otpRoutes from './routes/otpRoute.js'; // Import OTP routes
import Payment from './models/Payment.js'; // Import the Payment model (make sure this path is correct)

// Initialize Express app
const app = express();

// Set the port
const port = 5000;

// Middleware setup
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to the database
connectToMongo();

// Home route
app.get('/', (req, res) => {
  res.send('Razorpay Payment Gateway Using React And Node Js');
});

// Routes
app.use('/api/payment', payment); // Payment route
app.use('/api/address', Address); // Address route
app.use('/api/admin', admin); // Admin route
app.use('/api/otp', otpRoutes); // OTP route

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
