const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Забираем пользователя из БД
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    // Проверяем подписку: смотрим поле subscription.endDate (а не expiresAt)
    const now = new Date();
    const subscriptionActive =
      user.subscription &&
      user.subscription.endDate &&
      user.subscription.endDate > now;

    // Заполняем оба поля: и req.userId (для старых контроллеров), и req.user (для новых)
    req.userId = user._id;
    req.user = {
      id: user._id,
      isAdmin: user.isAdmin || false,
      subscriptionActive
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
