const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.get('/me', authMiddleware.verifyToken, authController.authMe);

module.exports = router;