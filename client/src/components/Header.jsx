import React, { useState } from 'react';
import AuthModal from './Auth/AuthModal';
import '../styles/Header.css';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="header">
        <div className="header__brand">
          <img src="/logo.png" alt="Логотип" className="header__logo" />
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
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>
            </svg>
          </button>
        </div>
        
        <button 
          onClick={() => setShowAuthModal(true)}
          className="auth-button"
        >
          Вход
        </button>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Header;