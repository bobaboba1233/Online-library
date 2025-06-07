import React from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ book, isSubscribed }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (book.isSubscriptionOnly && !isSubscribed) {
      alert("Эта книга доступна только по подписке. Пожалуйста, оформите подписку.");
    } else {
      navigate(`/bookDetails/${book._id}`);
    }
  };

  return (
    <div className="book-card">
      {/* Если книга только по подписке, а пользователь не подписан — показываем бейдж */}
      {book.isSubscriptionOnly && !isSubscribed && (
        <div className="subscription-badge">
          Только для подписчиков
        </div>
      )}

      <div 
        className="book-info" 
        onClick={handleClick} 
        style={{ cursor: "pointer" }}
      >
        <img src={book.cover} alt="Обложка" />
        <div className="book-details">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
        </div>
      </div>

      <div className="book-genre">{book.genre}</div>

      {/* Кнопка «Читать». Если доступ запрещён, дизейблим */}
      <button
        className="read-button"
        onClick={handleClick}
        disabled={book.isSubscriptionOnly && !isSubscribed}
      >
        Читать
      </button>
    </div>
  );
}
