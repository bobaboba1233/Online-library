const { verifyToken } = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  let user;
  let validToken;

  beforeAll(async () => {
    // Создаем тестового пользователя с активной подпиской
    user = await User.create({
      username: 'authuser',
      email: 'auth@test.com',
      password: 'password123',
      subscription: {
        endDate: new Date(Date.now() + 86400000) // Подписка активна
      }
    });

    validToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  it('should set req.user for valid token', async () => {
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(req.user).toEqual({
      id: user._id,
      isAdmin: false,
      subscriptionActive: true
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 for invalid token', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid.token'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Неверный токен'
    });
  });
});