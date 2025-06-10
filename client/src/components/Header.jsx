import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onSearch, onAuthClick, isLoggedIn, userData }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMenuOpen(false);
    navigate('/');
    window.location.reload(); // Добавлено для обновления состояния
  };

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
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && localSearchQuery.trim()) {
      onSearch(localSearchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <header className="header" style={{ cursor: 'pointer' }}>
      <div className="header__brand" onClick={() => {
      window.location.href = '/';}}>
        <img src="/logo-book.png" alt="Логотип" className="header__logo" />
        <h1 className="header__title">Библиотека</h1>
      </div>

      <form className="search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search__input"
          placeholder="Поиск книг..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button type="submit" className="search__button">
          <svg className="search__icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </svg>
        </button>
      </form>

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
          onClick={onAuthClick}
        >
          Вход
        </button>
      )}
    </header>
  );
};

export default Header;