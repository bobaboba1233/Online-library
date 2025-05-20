const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  const token = authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // убедись, что JWT_SECRET задан

    req.userId = decoded.userId; // или как там у тебя называется поле

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
