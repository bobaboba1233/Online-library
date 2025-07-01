const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    index: true
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'],
    index: true 
  },
  genre: { 
    type: String,
    enum: ['Фантастика', 'Детектив', 'Роман', 'Научная литература'],
    default: 'Фантастика'
  },
  cover: { 
    type: String,
    default: '/default-cover.jpg'
  },
  year: { 
    type: Number,
    min: [1800, 'Year must be after 1800'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  pages: { 
    type: Number,
    min: [1, 'Book must have at least 1 page']
  },
  price: { 
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  inStock: { 
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  isSubscriptionOnly: {           // ← новое поле
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'books',
  autoIndex: true
});

module.exports = mongoose.model('Book', bookSchema);