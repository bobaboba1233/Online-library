// tests/DataBase/user.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

test('Создаёт пользователя с валидными данными', async () => {
  const user = await User.create({
    username: 'Артем',
    email: '123@example.ru',
    password: 'password123', // обычный пароль, будет захеширован
  });
  expect(user.username).toBe('Артем');
  expect(user.email).toBe('123@example.ru');
  expect(user.password).not.toBe('password123'); // пароль должен быть захеширован
  expect(user.createdAt).toBeInstanceOf(Date);
});

test('Нельзя создать пользователя без email', async () => {
  await expect(User.create({
    username: 'Без email',
    password: 'password123'
  })).rejects.toThrow();
});

test('Нельзя создать двух пользователей с одинаковым email', async () => {
  await User.create({
    username: 'Пользователь 1',
    email: 'same@example.com',
    password: 'password123'
  });
  await expect(User.create({
    username: 'Пользователь 2',
    email: 'same@example.com',
    password: 'password456'
  })).rejects.toThrow();
});

test('Корректно сохраняется подписка', async () => {
  const user = await User.create({
    username: 'Богдан',
    email: 'bogdan@example.com',
    password: 'password123',
    subscription: {
      isActive: true,
      endDate: new Date('2025-07-02')
    }
  });
  expect(user.subscription.isActive).toBe(true);
  expect(user.subscription.endDate).toBeInstanceOf(Date);
});
