import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { Search } from "lucide-react";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        // Замените URL на ваш реальный эндпоинт API
        const response = await axios.get("/api/books", {
          params: { search: searchQuery }
        });
        setBooks(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке книг:", err);
        setError("Не удалось загрузить список книг");
      } finally {
        setLoading(false);
      }
    };

    // Добавляем задержку для поиска, чтобы не делать запрос при каждом нажатии клавиши
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        <div className="header-avatar">
          <Avatar src="/profile-avatar.png" />
        </div>
      </div>

      {/* Состояния загрузки и ошибки */}
      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">{error}</div>}

      {/* Book list */}
      <div className="book-list">
        {!loading && !error && books.length === 0 && (
          <div className="no-results">Книги не найдены</div>
        )}

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