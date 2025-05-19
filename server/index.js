require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
async function connectToDatabase() {
  try {
    // Используем 127.0.0.1 вместо localhost для избежания IPv6 проблем
    await mongoose.connect('mongodb://127.0.0.1:27017/online_library', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB (online_library)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Проверьте, что MongoDB запущен и доступен на mongodb://127.0.0.1:27017');
    process.exit(1); // Завершаем процесс, если подключение не удалось
  }
}

// Запускаем подключение к БД
connectToDatabase();

app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/auth', authRoutes);
// Обработка 404 для API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});