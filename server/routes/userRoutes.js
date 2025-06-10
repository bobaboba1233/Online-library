const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/avatars/' });
// Роуты профиля пользователя
router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);
router.put('/profile', authMiddleware.verifyToken, userController.updateUserProfile);
router.put('/avatar', authMiddleware.verifyToken, upload.single('avatar'), userController.avatar);
// Роуты подписки
router.post('/subscribe', authMiddleware.verifyToken, userController.subscribeUser);
router.post('/unsubscribe', authMiddleware.verifyToken, userController.unsubscribeUser);

// Админ-роуты (если нужны)
router.get('/admin/users', authMiddleware.verifyToken, userController.getUsers);
router.put('/admin/users/:id/subscription', authMiddleware.verifyToken, userController.updateUserSubscription);

module.exports = router;