const { getAllBooks, getBookById } = require('../../controllers/bookController');
const Book = require('../../models/Book');
const mongoose = require('mongoose');

describe('Book Controller', () => {
  let testBook;

  beforeAll(async () => {
    testBook = await Book.create({
      title: 'Controller Test',
      author: 'Test Author'
    });
  });

  afterAll(async () => {
    await Book.deleteMany();
  });

  // getAllBooks
  describe('getAllBooks', () => {
    it('should return all books without search', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getAllBooks(req, res);
      expect(res.json.mock.calls[0][0].length).toBeGreaterThan(0);
    });

    it('should filter books by search query', async () => {
      const req = { query: { search: 'Controller' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getAllBooks(req, res);
      expect(res.json.mock.calls[0][0][0].title).toBe('Controller Test');
    });
  });

  // getBookById
  describe('getBookById', () => {
    it('should return a book by ID', async () => {
      const req = { params: { id: testBook._id } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getBookById(req, res);
      expect(res.json.mock.calls[0][0]._id.toString()).toBe(testBook._id.toString());
    });

    it('should return 404 for invalid ID', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await getBookById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});