import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../BookDetails.css';
import axios from 'axios';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Замените URL на ваш реальный эндпоинт API
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке данных о книге:', err);
        setError('Не удалось загрузить информацию о книге');
        if (err.response && err.response.status === 404) {
          setError('Книга не найдена');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Вернуться на предыдущую страницу
  };

  const handleAddToCart = () => {
    if (!book) return;
    alert(`Книга "${book.title}" добавлена в корзину!`);
    // Здесь будет логика добавления в корзину
    // Например: dispatch(addToCart(book));
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Книга не найдена</div>;

  return (
    <div className="book-details">
      <button className="back-button" onClick={handleBack}>← Назад</button>
      
      <div className="book-container">
        <div className="book-cover">
          <img 
            src={book.cover || 'https://via.placeholder.com/300x450?text=No+Cover'} 
            alt={book.title} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
            }}
          />
        </div>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>{book.author} ({book.year})</h2>
          
          <div className="meta-info">
            <span className="genre">{book.genre}</span>
            {book.pages && <span className="pages">{book.pages} страниц</span>}
            {book.rating && (
              <span className={`rating ${book.rating > 4.5 ? 'high-rating' : ''}`}>
                ★ {book.rating}/5
              </span>
            )}
            <span className={`availability ${book.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {book.inStock ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>
          
          {book.description && <p className="description">{book.description}</p>}
          
          <div className="price-section">
            {book.price && <span className="price">{book.price} ₽</span>}
            <button 
              className="add-to-cart" 
              onClick={handleAddToCart}
              disabled={!book.inStock}
            >
              {book.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="additional-info">
        <h3>Дополнительная информация</h3>
        {book.publisher && <p>Издательство: {book.publisher}</p>}
        {book.isbn && <p>ISBN: {book.isbn}</p>}
        {book.language && <p>Язык: {book.language}</p>}
        {book.binding && <p>Переплет: {book.binding}</p>}
      </div>
    </div>
  );
}

export default BookDetails;