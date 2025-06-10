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

// Оформление подписки (с поддержкой разных сроков)
exports.subscribeUser = async (req, res) => {
  try {
    const { duration } = req.body; // Получаем duration (1, 3 или 12 месяцев)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем, что duration корректен
    const allowedDurations = [1, 3, 12];
    if (!allowedDurations.includes(duration)) {
      return res.status(400).json({ message: 'Некорректная длительность подписки' });
    }

    // Рассчитываем дату окончания
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    endDate.setHours(0, 0, 0, 0);

    // Обновляем подписку
    user.subscription = {
      isActive: true,
      startDate,
      endDate,
      planDuration: duration // Сохраняем длительность для истории
    };

    await user.save();

    res.json({
      message: `Подписка успешно оформлена на ${duration} ${getMonthText(duration)}`,
      subscription: user.subscription
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при оформлении подписки', error: err.message });
  }
};

// Вспомогательная функция для склонения "месяц/месяца/месяцев"
function getMonthText(duration) {
  if (duration === 1) return 'месяц';
  if (duration >= 2 && duration <= 4) return 'месяца';
  return 'месяцев';
}
// Новые функции для админ-панели
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      subscription: {
        isActive: user.subscription?.isActive || false,
        endDate: user.subscription?.endDate || null
      }
    })));
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка при получении списка пользователей',
      error: error.message 
    });
  }
};

exports.updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, months = 1 } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    let endDate = null;
    if (isActive) {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
    }

    user.subscription = {
      isActive,
      endDate: isActive ? endDate : null
    };

    await user.save();

    res.json({
      message: `Подписка успешно ${isActive ? 'активирована' : 'деактивирована'}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка при обновлении подписки',
      error: error.message 
    });
  }
};