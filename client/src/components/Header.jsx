import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthModal from './Auth/AuthModal';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      handleLogout();
    }
  };

  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
      setShowAuthModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setMenuOpen(false);
    navigate('/');
  };

  // Обработка кликов вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (avatarRef.current && !avatarRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header__brand" onClick={() => navigate('/')}>
          <img src="/logo-book.png" alt="Логотип" className="header__logo" />
          <h1 className="header__title">Библиотека</h1>
        </div>

        <div className="search">
          <input
            type="text"
            className="search__input"
            placeholder="Поиск книг..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="search__button">
            <svg className="search__icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
            </svg>
          </button>
        </div>

        {isLoggedIn ? (
          <div className="user-menu" ref={menuRef}>
            <div 
              className="user-avatar" 
              onClick={toggleMenu}
              ref={avatarRef}
            >
              {userData?.avatar ? (
                <img src={userData.avatar} alt="Аватар" className="avatar-image" />
              ) : (
                <div className="avatar-initials">
                  {userData?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {menuOpen && (
              <div className="dropdown-menu">
                <p className="user-email">{userData?.email}</p>
                <button 
                  onClick={() => {
                    navigate('/profile');
                    setMenuOpen(false);
                  }}
                >
                  Профиль
                </button>
                <button onClick={handleLogout}>Выйти</button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="auth-button" 
            onClick={() => setShowAuthModal(true)}
          >
            Вход
          </button>
        )}
      </header>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </>
  );
};

export default Header;