const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { adminLogin } = require('../controllers/adminController');
const { 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const {
  getUsers,
  updateUserSubscription
} = require('../controllers/userController');

router.post('/login', adminLogin);
router.post('/books', adminAuth, createBook);
router.put('/books/:id', adminAuth, updateBook);
router.delete('/books/:id', adminAuth, deleteBook);

// Работа с пользователями (только для админов)
router.get('/users', adminAuth, getUsers);
router.put('/users/:id/subscription', adminAuth, updateUserSubscription);
module.exports = router;  