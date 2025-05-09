import express from 'express';
import OTP from '../models/OTPModel.js';
import User from '../models/UserModel.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate a new OTP
    const otp = generateOTP();
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });
    
    // Save new OTP to database
    const otpDocument = new OTP({
      email,
      otp
    });
    
    await otpDocument.save();
    
    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for OilWallah',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP', 
      error: error.message 
    });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    
    // Find the OTP document
    const otpDocument = await OTP.findOne({ email, otp });
    
    if (!otpDocument) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired' });
    }
    
    // Find or create the user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        isVerified: true
      });
      await user.save();
    } else {
      // Update user to verified
      user.isVerified = true;
      await user.save();
    }
    
    // Delete the OTP document
    await OTP.deleteOne({ _id: otpDocument._id });
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified
      }
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP', 
      error: error.message 
    });
  }
});

export default router;