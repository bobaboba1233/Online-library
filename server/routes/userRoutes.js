const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, getUserProfile);
router.put('/me', auth, updateUserProfile);

router.post('/subscribe', auth.verifyToken, userController.subscribeUser);

module.exports = router;