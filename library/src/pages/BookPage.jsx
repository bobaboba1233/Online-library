import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Заглушка данных, потом заменить на API-запрос
  const bookData = {
    id: 1,
    title: "Ночной дозор",
    author: "Сергей Лукьяненко",
    genre: "Фантастика",
    description: "Описание книги...",
    year: 1998,
    pages: 432
  };

  return (
    <div className="book-page">
      <button onClick={() => navigate(-1)}>Назад</button>
      <h1>{bookData.title}</h1>
      <div className="book-content">
        <img src="/book-cover.jpg" alt="Обложка" />
        <div className="book-details">
          <p>Автор: {bookData.author}</p>
          <p>Жанр: {bookData.genre}</p>
          <p>Год издания: {bookData.year}</p>
          <p>Количество страниц: {bookData.pages}</p>
          <p>{bookData.description}</p>
        </div>
      </div>
    </div>
  );
}