import React from "react";

export default function Card({ book }) {
  return (
    <div className="book-card">
      <div className="book-info">
        <img src={book.cover} alt="cover" />
        <div className="book-details">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
        </div>
      </div>
      <div className="book-genre">{book.genre}</div>
    </div>
  );
}
