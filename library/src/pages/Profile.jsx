import React, { useState } from 'react';
import '../Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    phone: '+7 (123) 456-78-90',
    bio: 'Фронтенд разработчик',
    location: 'Москва'
  });

  const handleSubscribe = () => {
    console.log('Переход к оплате подписки');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Здесь можно добавить логику сохранения на сервер
    console.log('Данные сохранены:', userData);
  };

  return (
    <div className="profile-page">
      <h1>Профиль пользователя</h1>
      
      <div className="user-info">
        {isEditing ? (
          <>
            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Телефон:</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>О себе:</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Город:</label>
              <input
                type="text"
                name="location"
                value={userData.location}
                onChange={handleInputChange}
              />
            </div>
          </>
        ) : (
          <>
            <p><strong>Имя:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Телефон:</strong> {userData.phone}</p>
            <p><strong>О себе:</strong> {userData.bio}</p>
            <p><strong>Город:</strong> {userData.location}</p>
          </>
        )}
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Редактировать профиль</button>
        )}
        <button className="subscribe-btn" onClick={handleSubscribe}>Купить подписку</button>
      </div>
    </div>
  );
}

export default Profile;