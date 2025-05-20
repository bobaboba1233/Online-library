import React, { useState, useEffect, Suspense } from "react";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import Header from "../components/Header"; // Импортируем новый Header
const AuthModal = React.lazy(() => import("../components/Auth/AuthModal"));

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/books?search=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error("Ошибка загрузки");
        setBooks(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchQuery]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      {/* Используем новый Header компонент */}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAuthClick={() => setShowAuthModal(true)}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <Suspense fallback={<div>Загрузка...</div>}>
          <AuthModal onClose={() => setShowAuthModal(false)} />
        </Suspense>
      )}

      {/* Book List */}
      <div className="book-list">
        {books.map((book) => (
          <Link key={book._id} to={`/bookDetails/${book._id}`} className="book-link">
            <Card book={book} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;