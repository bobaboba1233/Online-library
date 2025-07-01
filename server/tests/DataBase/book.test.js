import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Book from '../../models/Book';  // путь к твоей модели

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
  await Book.deleteMany({});
});

test('Создаёт книгу с валидными данными', async () => {
  const bookData = {
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'Роман',
    year: 1869,
    pages: 1225,
    price: 1000,
    inStock: true,
    rating: 4.8,
    isSubscriptionOnly: false,
    description: 'Классический роман'
  };

  const book = await Book.create(bookData);

  expect(book.title).toBe(bookData.title);
  expect(book.author).toBe(bookData.author);
  expect(book.genre).toBe(bookData.genre);
  expect(book.year).toBe(bookData.year);
  expect(book.pages).toBe(bookData.pages);
  expect(book.price).toBe(bookData.price);
  expect(book.inStock).toBe(true);
  expect(book.rating).toBeCloseTo(bookData.rating);
  expect(book.isSubscriptionOnly).toBe(false);
  expect(book.description).toBe(bookData.description);
  expect(book.createdAt).toBeInstanceOf(Date);
});

test('По умолчанию genre и cover установлены', async () => {
  const book = await Book.create({
    title: 'Новая книга',
    author: 'Автор',
  });
  expect(book.genre).toBe('Фантастика');
  expect(book.cover).toBe('/default-cover.jpg');
});

test('Ошибка при отсутствии обязательных полей', async () => {
  await expect(Book.create({})).rejects.toThrow();
});

test('Ошибка при недопустимом значении genre', async () => {
  await expect(Book.create({
    title: 'Тест',
    author: 'Автор',
    genre: 'Комедия'
  })).rejects.toThrow();
});

test('Ошибка при отрицательной цене', async () => {
  await expect(Book.create({
    title: 'Тест',
    author: 'Автор',
    price: -10
  })).rejects.toThrow();
});

test('Ошибка при слишком большой оценке', async () => {
  await expect(Book.create({
    title: 'Тест',
    author: 'Автор',
    rating: 6
  })).rejects.toThrow();
});
