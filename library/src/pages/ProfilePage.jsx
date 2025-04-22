import React from "react";

export default function ProfilePage() {
  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="user-info">
        {/* Место для данных из бэкенда */}
        <p>Имя: [Имя пользователя]</p>
        <p>Email: [email@example.com]</p>
        <p>Подписка: Неактивна</p>
      </div>
      <button className="subscribe-btn">Купить подписку</button>
      {/* Место для дополнительных элементов бэкенда */}
    </div>
  );
}