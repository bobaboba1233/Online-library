const User = require('../models/User');

// Получение профиля пользователя
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    // Проверяем, не истекла ли подписка
    let subscriptionStatus = {
      isActive: false,
      endDate: null
    };
    if (user.subscription && user.subscription.endDate) {
      const now = new Date();
      if (user.subscription.endDate > now) {
        subscriptionStatus = {
          isActive: true,
          endDate: user.subscription.endDate
        };
      } else {
        // Если подписка истекла, сбрасываем её в базе
        user.subscription.isActive = false;
        user.subscription.endDate = null;
        await user.save();
      }
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      subscription: subscriptionStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновление профиля пользователя (только определённые поля)
exports.updateUserProfile = async (req, res) => {
  try {
    const allowedUpdates = ['username', 'email'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      subscription: {
        isActive: user.subscription.isActive,
        endDate: user.subscription.endDate
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Оформление подписки
exports.subscribeUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    // Устанавливаем дату окончания подписки через 30 дней
    const now = new Date();
    const endDate = new Date(now.setDate(now.getDate() + 30));

    user.subscription = {
      isActive: true,
      endDate
    };
    await user.save();

    res.json({
      message: 'Подписка успешно оформлена',
      subscription: {
        isActive: true,
        endDate: user.subscription.endDate
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при оформлении подписки', error: err.message });
  }
};
