import React from "react";
import Input from "../components/Input";
import { Search } from "lucide-react";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import { Link } from "react-router-dom";

function Home() {
  const books = [
    {
      id: 1,
      cover: "/book-cover.jpg",
      title: "Ночной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      id: 2,
      cover: "/book-cover.jpg",
      title: "Дневной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      id: 3,
      cover: "/book-cover.jpg",
      title: "Сумеречный дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      id: 4,
      cover: "/book-cover.jpg",
      title: "Последний дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <Link to="/" className="logo">
            <img src="/logo-book.png" alt="logo" />
            <h1>Библиотека</h1>
          </Link>
        </div>

        <div className="header-search">
          <div className="header-search-input">
            <Input
              type="text"
              placeholder="Поиск..."
            />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        <div className="header-avatar">
          <Avatar src="/profile-avatar.png" />
        </div>
      </div>

      {/* Book list */}
      <div className="book-list">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book/${book.id}`}
            className="no-underline text-inherit"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card book={book} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
