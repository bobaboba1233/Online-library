import React, { useState, useEffect, Suspense } from "react";
import Card from "../components/Card";
import axios from "axios";
import "../styles/Home.css";
import Header from "../components/Header";

// Настройка axios для обработки ошибок 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // Обновляем страницу при истечении токена
    }
    return Promise.reject(error);
  }
);

const AuthModal = React.lazy(() => import("../components/Auth/AuthModal"));

function Home() {
  const [books, setBooks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchData = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const booksPromise = axios.get(
        `http://localhost:5000/api/books?search=${encodeURIComponent(query)}`,
        { headers }
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
      if (err.response?.status === 401) {
        setUserData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchData(query);
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <Header
        onSearch={handleSearch}
        onAuthClick={handleAuthClick}
        isLoggedIn={!!userData}
        userData={userData}
      />

      {showAuthModal && (
        <Suspense fallback={<div>Загрузка...</div>}>
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLoginSuccess={(user) => {
              setUserData(user);
              setShowAuthModal(false);
              fetchData(searchQuery);
            }}
          />
        </Suspense>
      )}

      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <Card
              key={book._id}
              book={book}
              isSubscribed={userData?.subscription?.isActive || false}
              token={localStorage.getItem("token")}
            />
          ))
        ) : (
          <div className="no-results">
            {searchQuery ? "Ничего не найдено" : "Книги не найдены"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;