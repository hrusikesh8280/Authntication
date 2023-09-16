const express = require('express');
const router = express.Router();
const { generateAndSendOTP } = require('../otpService');
const admin = require('../fireBaseConfig');

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Create a new user with email and password using Firebase Admin SDK
    await admin.auth().createUser({
      phoneNumber: phoneNumber,
      password: password,
    });
    const otpSent = await generateAndSendOTP(phoneNumber);

    if (otpSent) {
      res.status(201).json({ message: 'User registered successfully. OTP sent.' });
    } else {
      res.status(500).json({ error: 'Registration failed.' });
    }
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'User registration failed.' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const userCredential = await admin.auth().signInWithEmailAndPassword(phoneNumber, password);

    const otpSent = await generateAndSendOTP(phoneNumber);

    if (otpSent) {
      res.status(200).json({ message: 'User login successful. OTP sent.' });
    } else {
      res.status(500).json({ error: 'Login failed.' });
    }
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'User login failed.' });
  }
});

// OTP Verification
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const userDoc = await admin.firestore().collection('users').doc(phoneNumber).get();

    if (userDoc.exists && userDoc.data().otp === otp) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

module.exports = router;
