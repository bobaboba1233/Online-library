const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const { isSubscriptionOnly, ...otherData } = req.body;

    const newBook = new Book({
      ...otherData,
      isSubscriptionOnly: Boolean(isSubscriptionOnly),
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      year: Number(req.body.year),
      pages: Number(req.body.pages),
      price: Number(req.body.price),
      rating: Number(req.body.rating),
      ...(req.body.isSubscriptionOnly !== undefined && {
        isSubscriptionOnly: Boolean(req.body.isSubscriptionOnly),
      }),
    };

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Книга удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
