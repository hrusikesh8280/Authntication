// otpService.js
const admin = require('./fireBaseConfig');
const twilioConfig = require('./twilioConfig');
const twilio = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

async function generateAndSendOTP(phoneNumber) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await admin.firestore().collection('users').doc(phoneNumber).set({ otp });
    await twilio.messages.create({
      body: `Your OTP: ${otp}`,
      from: twilioConfig.phoneNumber,
      to: phoneNumber,
    });

    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

module.exports = { generateAndSendOTP };
