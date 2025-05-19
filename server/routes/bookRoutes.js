const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById
} = require('../controllers/bookController');

// GET /api/books - все книги с поиском
router.get('/', getAllBooks);

// GET /api/books/:id - конкретная книга
router.get('/:id', getBookById);

module.exports = router;