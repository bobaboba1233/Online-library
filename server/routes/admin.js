const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { adminLogin } = require('../controllers/adminController');
const { 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');

router.post('/login', adminLogin);
router.post('/books', adminAuth, createBook);
router.put('/books/:id', adminAuth, updateBook);
router.delete('/books/:id', adminAuth, deleteBook);

module.exports = router;