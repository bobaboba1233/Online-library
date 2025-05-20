const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // проверь SECRET
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Нет прав администратора' });
    }
    req.user = decoded;
    next(); // <- важно!
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

module.exports = adminAuth;
