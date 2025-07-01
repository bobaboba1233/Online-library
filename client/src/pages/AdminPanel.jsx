import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  // Состояния для управления вкладками
  const [activeTab, setActiveTab] = useState('books');
  
  // Состояния для управления книгами
  const [books, setBooks] = useState([]);
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    genre: 'Фантастика',
    cover: '/default-cover.jpg',
    year: '',
    pages: '',
    price: '',
    inStock: true,
    rating: 0,
    description: '',
    isSubscriptionOnly: false
  });
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  
  // Состояния для управления подписками
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка данных при монтировании и переключении вкладок
  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    } else if (activeTab === 'subscriptions') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setIsLoadingBooks(false);
    } catch (error) {
      alert('Ошибка загрузки книг');
    }
  };
    useEffect(() => {
      if (activeTab === 'subscriptions') {
        console.log('Users data:', users); // Добавьте эту строку
        fetchUsers();
      }
    }, [activeTab]);
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Добавляем проверку данных
        const usersWithIds = response.data.map(user => {
          if (!user.id) {
            console.warn('User without _id:', user);
          }
          return user;
        });
        
        setUsers(usersWithIds);
        setIsLoadingUsers(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Ошибка загрузки пользователей');
      }
    };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedData = {
        ...bookFormData,
        year: Number(bookFormData.year),
        pages: Number(bookFormData.pages),
        price: Number(bookFormData.price),
        rating: Number(bookFormData.rating),
        isSubscriptionOnly: Boolean(bookFormData.isSubscriptionOnly)
      };

      const token = localStorage.getItem('adminToken');

      if (editingId) {
        const response = await axios.put(
          `http://localhost:5000/api/admin/books/${editingId}`,
          transformedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBooks(prevBooks =>
          prevBooks.map(book =>
            book._id === editingId ? response.data : book
          )
        );
        alert('Книга успешно обновлена!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/admin/books',
          transformedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBooks(prevBooks => [...prevBooks, response.data]);
        alert('Книга успешно добавлена!');
      }

      resetBookForm();
    } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditBook = (book) => {
    setBookFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      cover: book.cover,
      year: book.year,
      pages: book.pages,
      price: book.price,
      inStock: book.inStock,
      rating: book.rating,
      description: book.description || '',
      isSubscriptionOnly: book.isSubscriptionOnly || false
    });
    setPreview(book.cover);
    setEditingId(book._id);
    window.scrollTo(0, 0);
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(
          `http://localhost:5000/api/admin/books/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBooks(prevBooks => prevBooks.filter(book => book._id !== id));
        alert('Книга успешно удалена!');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления книги');
      }
    }
  };

  const resetBookForm = () => {
    setBookFormData({
      title: '',
      author: '',
      genre: 'Фантастика',
      cover: '/default-cover.jpg',
      year: '',
      pages: '',
      price: '',
      inStock: true,
      rating: 0,
      description: '',
      isSubscriptionOnly: false
    });
    setPreview('');
    setEditingId(null);
  };

  const handleBookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'cover') {
      setPreview(value);
    }
  };

 const toggleUserSubscription = async (userId, currentStatus) => {
  // Добавляем проверку ID
  if (!userId || userId === 'undefined') {
    console.error('Invalid user ID:', userId);
    alert('Ошибка: неверный ID пользователя');
    return;
  }

  if (!window.confirm(`Вы уверены, что хотите ${currentStatus ? 'отключить' : 'включить'} подписку?`)) {
    return;
  }

  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Токен администратора не найден');
    }

    const response = await axios.put(
      `http://localhost:5000/api/admin/user/${userId}/subscription`,
      { isActive: !currentStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Обновляем состояние с проверкой ID
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId
          ? {
              ...user,
              subscription: {
                ...user.subscription,
                isActive: !currentStatus,
                endDate: !currentStatus 
                  ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                  : null
              }
            }
          : user
      )
    );
    
    alert(`Подписка успешно ${!currentStatus ? 'включена' : 'отключена'}!`);
  } catch (error) {
    console.error('Ошибка обновления подписки:', {
      error,
      response: error.response?.data
    });
    alert(`Ошибка: ${error.response?.data?.message || error.message}`);
  }
};

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          Управление книгами
        </button>
        <button
          className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Модерация подписок
        </button>
      </div>

      {activeTab === 'books' ? (
        <>
          <h2>{editingId ? 'Редактировать книгу' : 'Добавить новую книгу'}</h2>
          <form onSubmit={handleBookSubmit} className="book-form">
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
                value={bookFormData.title}
                onChange={handleBookChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Автор:</label>
              <input
                type="text"
                name="author"
                value={bookFormData.author}
                onChange={handleBookChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Жанр:</label>
              <select
                name="genre"
                value={bookFormData.genre}
                onChange={handleBookChange}
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
                type="text"
                name="cover"
                value={bookFormData.cover}
                onChange={handleBookChange}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                name="description"
                value={bookFormData.description}
                onChange={handleBookChange}
                rows="5"
                placeholder="Введите описание книги..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Год издания:</label>
                <input
                  type="number"
                  name="year"
                  value={bookFormData.year}
                  onChange={handleBookChange}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label>Количество страниц:</label>
                <input
                  type="number"
                  name="pages"
                  value={bookFormData.pages}
                  onChange={handleBookChange}
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
                  value={bookFormData.price}
                  onChange={handleBookChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Рейтинг:</label>
                <input
                  type="number"
                  name="rating"
                  value={bookFormData.rating}
                  onChange={handleBookChange}
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
                  checked={bookFormData.inStock}
                  onChange={handleBookChange}
                />
                В наличии
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isSubscriptionOnly"
                  checked={bookFormData.isSubscriptionOnly}
                  onChange={handleBookChange}
                />
                Только для подписки
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {editingId ? 'Сохранить изменения' : 'Добавить книгу'}
              </button>
              {editingId && (
                <button type="button" className="cancel-btn" onClick={resetBookForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>

          <h3>Список книг</h3>
          {isLoadingBooks ? (
            <div className="loading">Загрузка...</div>
          ) : (
            <div className="books-list">
              <div className="books-header">
                <span>Обложка</span>
                <span>Название</span>
                <span>Автор</span>
                <span>Подписка</span>
                <span>Действия</span>
              </div>
              {books.map(book => (
                <div className="book-item" key={book._id}>
                  <div className="book-cover">
                    <img src={book.cover} alt={book.title} />
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>
                  <div className="book-subscription-status">
                    {book.isSubscriptionOnly ? '✅ Да' : '—'}
                  </div>
                  <div className="book-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditBook(book)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBook(book._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Модерация подписок</h2>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Поиск пользователей по email или имени..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoadingUsers ? (
            <div className="loading">Загрузка пользователей...</div>
          ) : (
            <div className="users-list">
              <div className="users-header">
                <span>Имя</span>
                <span>Email</span>
                <span>Подписка</span>
                <span>Действия</span>
              </div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div className="user-item" key={user.id}>
                    <div className="user-name">
                      {user.name || 'Не указано'}
                    </div>
                    <div className="user-email">
                      {user.email}
                    </div>
                    <div className="user-subscription-status">
                      {user.subscription?.isActive ? '✅ Активна' : '❌ Не активна'}
                    </div>
                    <div className="user-actions">
                      <button
                        className={`subscription-btn ${user.subscription?.isActive ? 'cancel' : 'activate'}`}
                        onClick={() => toggleUserSubscription(user.id, user.subscription?.isActive)}
                      >
                        {user.subscription?.isActive ? 'Отключить' : 'Включить'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">Пользователи не найдены</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;