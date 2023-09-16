const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const firebaseConfig = require("../fireBaseConfig");


admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig), 
  databaseURL: firebaseConfig.databaseURL,
});


const isAuthenticated = async (req, res, next) => {
  try {

    const idToken = req.headers.authorization;
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    next(); 
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Dashboard route
router.get('/', isAuthenticated, (req, res) => {
  res.send('Welcome to the Dashboard!');
});

module.exports = router;
