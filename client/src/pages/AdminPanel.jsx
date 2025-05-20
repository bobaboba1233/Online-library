import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Фантастика',
    cover: '/default-cover.jpg',
    year: '',
    pages: '',
    price: '',
    inStock: true,
    rating: 0,
    description: ''
  });
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка книг при монтировании
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setIsLoading(false);
    } catch (error) {
      alert('Ошибка загрузки книг');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Преобразование данных перед отправкой
      const transformedData = {
        ...formData,
        year: Number(formData.year),
        pages: Number(formData.pages),
        price: Number(formData.price),
        rating: Number(formData.rating)
      };

      const token = localStorage.getItem('adminToken');
      
      if (editingId) {
        // Редактирование существующей книги
        const response = await axios.put(
          `http://localhost:5000/api/admin/books/${editingId}`,
          transformedData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Непосредственное обновление состояния
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book._id === editingId ? response.data : book
          )
        );
        alert('Книга успешно обновлена!');
      } else {
        // Создание новой книги
        const response = await axios.post(
          'http://localhost:5000/api/admin/books',
          transformedData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Добавление новой книги в состояние
        setBooks(prevBooks => [...prevBooks, response.data]);
        alert('Книга успешно добавлена!');
      }
      
      resetForm();
      
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
      console.error(error.response);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      cover: book.cover,
      year: book.year,
      pages: book.pages,
      price: book.price,
      inStock: book.inStock,
      rating: book.rating,
      description: book.description || ''
    });
    setPreview(book.cover);
    setEditingId(book._id);
    window.scrollTo(0, 0);
  };

 const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(
          `http://localhost:5000/api/admin/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Непосредственное удаление из состояния
        setBooks(prevBooks => 
          prevBooks.filter(book => book._id !== id)
        );
        alert('Книга успешно удалена!');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления книги');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: 'Фантастика',
      cover: '/default-cover.jpg',
      year: '',
      pages: '',
      price: '',
      inStock: true,
      rating: 0,
      description: ''
    });
    setPreview('');
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'cover') {
      setPreview(value);
    }
  };

  return (
    <div className="admin-panel">
      <h2>{editingId ? 'Редактировать книгу' : 'Добавить новую книгу'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
           {/* Превью обложки */}
        {preview && (
          <div className="cover-preview">
            <img src={preview} alt="Превью обложки" />
          </div>
        )}

        <div className="form-group">
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Автор:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Жанр:</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="Фантастика">Фантастика</option>
            <option value="Детектив">Детектив</option>
            <option value="Роман">Роман</option>
            <option value="Научная литература">Научная литература</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ссылка на обложку:</label>
          <input
            type="url"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Год издания:</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-group">
            <label>Количество страниц:</label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Цена:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Рейтинг:</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            В наличии
          </label>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {editingId ? 'Сохранить изменения' : 'Добавить книгу'}
          </button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Отмена
            </button>
          )}
        </div>
      </form>

      <h3>Список книг</h3>
      {isLoading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="books-list">
          <div className="books-header">
            <span>Обложка</span>
            <span>Название</span>
            <span>Автор</span>
            <span>Действия</span>
          </div>
          {books.map(book => (
            <div className="book-item" key={book._id}>
              <div className="book-cover">
                <img src={book.cover} alt={book.title} />
              </div>
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.author}</div>
              <div className="book-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(book)}
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(book._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;