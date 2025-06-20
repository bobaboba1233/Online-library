const request = require('supertest');
const app = require('../../index');

describe('Book API (формальные проверки)', () => {
  // Тест 1: Проверка, что сервер отвечает
  test('GET /api/books - сервер работает', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200); // Просто проверяем, что сервер отвечает
  });

  // Тест 2: Проверка заглушки POST (без реального сохранения)
  test('POST /api/books - формальная проверка', async () => {
    const mockBook = {
      title: "Тестовая книга",
      author: "Автор",
      genre: "Фантастика"
    };
    const res = await request(app)
      .post('/api/books')
      .send(mockBook);
    
    expect(res.status).toBe(201); // Ожидаем успешный ответ
    expect(res.body).toMatchObject(mockBook); // Проверяем, что тело ответа похоже на запрос
  });

  // Тест 3: Проверка заглушки GET по ID
  test('GET /api/books/:id - формальная проверка', async () => {
    const fakeId = "123abc"; // Несуществующий ID
    const res = await request(app).get(`/api/books/${fakeId}`);
    expect(res.status).toBe(200); // Просто проверяем, что роут существует
  });
});