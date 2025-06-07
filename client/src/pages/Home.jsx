import React, { useState, useEffect, Suspense } from "react";
import Card from "../components/Card";
import axios from "axios";
import "../styles/Home.css";
import Header from "../components/Header";
const AuthModal = React.lazy(() => import("../components/Auth/AuthModal"));

function Home() {
  const [books, setBooks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchBooksAndUser = async () => {
      try {
        // Параллельный запрос книг и данных пользователя (если есть токен)
        const token = localStorage.getItem("token");

        const booksPromise = axios.get(
          `http://localhost:5000/api/books?search=${encodeURIComponent(searchQuery)}`
        );

        let userPromise = Promise.resolve(null);
        if (token) {
          userPromise = axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        const [booksRes, userRes] = await Promise.all([booksPromise, userPromise]);
        setBooks(booksRes.data);
        if (userRes) {
          setUserData(userRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndUser();
  }, [searchQuery]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAuthClick={() => setShowAuthModal(true)}
      />

      {showAuthModal && (
        <Suspense fallback={<div>Загрузка...</div>}>
          <AuthModal onClose={() => setShowAuthModal(false)} />
        </Suspense>
      )}

      <div className="book-list">
        {books.map((book) => (
          <Card
            key={book._id}
            book={book}
            isSubscribed={userData?.subscription?.isActive || false}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
