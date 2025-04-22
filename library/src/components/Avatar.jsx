import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Avatar({ src }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !avatarRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="avatar-container" ref={avatarRef}>
      <div className="avatar" onClick={toggleMenu}>
        <img src={src} alt="avatar" />
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="slide-menu">
          <button className="menu-item" onClick={() => navigate('/profile')}>
            Профиль
          </button>
          <button className="menu-item">Настройки</button>
          <button className="menu-item">Выйти</button>
        </div>
      )}
    </div>
  );
}