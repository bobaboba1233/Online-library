import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookDetails.css';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!response.ok) throw new Error(response.status === 404 ? 'Книга не найдена' : 'Ошибка сервера');
        setBook(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleBack = () => navigate(-1);
const handleAddToCart = (url) => {
  window.location.href = "https://yandex.ru/video/preview/7548887151231436014";
};

  if (loading) return <div className="book-loading">Загрузка книги...</div>;
  if (error) return <div className="book-error">Ошибка: {error}</div>;
  if (!book) return <div className="book-not-found">Книга не найдена</div>;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-arrow">←</span> Все книги
        </button>
      </div>

      <div className="book-content-wrapper">
        <div className="book-cover-section">
          <img 
            src={book.cover || '/default-book-cover.jpg'} 
            alt={`Обложка: ${book.title}`} 
            className="book-main-cover"
          />
          {book.inStock && (
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Читать онлайн
            </button>
          )}
        </div>

        <div className="book-info-section">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">{book.author}</h2>
          
          <div className="book-meta">
            <span className="meta-item">{book.year}</span>
            <span className="meta-divider">•</span>
            <span className="meta-item">{book.pages} стр.</span>
            <span className="meta-divider">•</span>
            <span className="meta-item">{book.genre}</span>
          </div>

          <div className="book-rating">
            <span className={`rating-stars ${book.rating > 4 ? 'high-rating' : ''}`}>
              {'★'.repeat(Math.round(book.rating))}
              {'☆'.repeat(5 - Math.round(book.rating))}
            </span>
            <span className="rating-value">{book.rating.toFixed(1)}/5</span>
          </div>

          <div className={`availability-status ${book.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {book.inStock ? 'В наличии' : 'Нет в наличии'}
          </div>

          <div className="book-price-section">
            <span className="price">{book.price} ₽</span>
            {!book.inStock && (
              <button className="notify-button" disabled>
                Уведомить о поступлении
              </button>
            )}
          </div>

          <div className="book-description">
            <h3>Описание</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>

      <div className="book-details-section">
        <h3>Характеристики</h3>
        <div className="details-grid">
          <div className="detail-row">
            <span className="detail-label">Язык:</span>
            <span className="detail-value">{book.language || 'Русский'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Переплет:</span>
            <span className="detail-value">{book.bindingType || 'Твердый'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;