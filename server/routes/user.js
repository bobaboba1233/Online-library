const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // если есть
const User = require('../models/User');

// POST /api/user/subscribe
router.post('/subscribe', authMiddleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // подписка на 1 месяц

    user.subscription = {
      isActive: true,
      startDate: now,
      endDate
    };

    await user.save();

    res.json({ message: 'Подписка оформлена', subscription: user.subscription });
  } catch (err) {
    console.error('Ошибка подписки:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
