const jwt = require('jsonwebtoken');

exports.adminLogin = (req, res) => {
  const { login, password } = req.body;
  
  // Проверяем учетные данные
  if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Неверные учетные данные' });
  }

  // Генерируем токен
  const token = jwt.sign(
    { isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ 
    token,
    user: {
      isAdmin: true,
      login: process.env.ADMIN_LOGIN
    }
  });
};