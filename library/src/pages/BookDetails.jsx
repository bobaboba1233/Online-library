import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../BookDetails.css';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Моковые данные (в реальном приложении будет запрос к API)
  useEffect(() => {
    setLoading(true);
    // Имитация загрузки данных
    setTimeout(() => {
      const mockBooks = {
        '1': {
          title: 'Мастер и Маргарита',
          author: 'Михаил Булгаков',
          year: 1967,
          genre: 'Роман',
          description: 'Один из самых загадочных и увлекательных романов XX века, сочетающий философскую глубину с острой сатирой.',
          rating: 4.8,
          pages: 384,
          cover: 'https://avatars.mds.yandex.net/i?id=147a51e9498289de1ab338662b4a40424189daf1-7564382-images-thumbs&n=13',
          price: 450,
          inStock: true
        },
        '2': {
          title: 'Преступление и наказание',
          author: 'Фёдор Достоевский',
          year: 1866,
          genre: 'Психологический роман',
          description: 'Глубокий психологический анализ преступления и его последствий для личности.',
          rating: 4.9,
          pages: 592,
          cover: 'https://example.com/book2.jpg',
          price: 380,
          inStock: false
        }
      };
      
      if (mockBooks[id]) {
        setBook(mockBooks[id]);
      } else {
        setError('Книга не найдена');
      }
      setLoading(false);
    }, 800);
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Вернуться на предыдущую страницу
  };

  const handleAddToCart = () => {
    alert(`Книга "${book.title}" добавлена в корзину!`);
    // Здесь будет логика добавления в корзину
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return null;

  return (
    <div className="book-details">
      <button className="back-button" onClick={handleBack}>← Назад</button>
      
      <div className="book-container">
        <div className="book-cover">
          <img src={book.cover || 'book-cover.jpg'} alt={book.title} />
        </div>
        
        <div className="book-info">
          <h1>{book.title}</h1>
          <h2>{book.author} ({book.year})</h2>
          
          <div className="meta-info">
            <span className="genre">{book.genre}</span>
            <span className="pages">{book.pages} страниц</span>
            <span className={`rating ${book.rating > 4.5 ? 'high-rating' : ''}`}>
              ★ {book.rating}/5
            </span>
            <span className={`availability ${book.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {book.inStock ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>
          
          <p className="description">{book.description}</p>
          
          <div className="price-section">
            <span className="price">{book.price} ₽</span>
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
        <p>Издательство: "Эксмо"</p>
        <p>ISBN: 978-5-699-12345-6</p>
        <p>Язык: Русский</p>
        <p>Переплет: Твердый</p>
      </div>
    </div>
  );
}

export default BookDetails;