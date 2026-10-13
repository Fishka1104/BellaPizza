import React from 'react';

/**
 * Функціональний компонент Header
 * Виводить заголовок та підзаголовок профілю користувача
 */
function Header(props) {
  return (
    <header className="profile-header text-center mb-3">
      <h3 className="h4 mb-1 text-dark fw-bold">
        {props.title || "Особистий профіль"}
      </h3>
      <span className="badge bg-danger px-3 py-1 rounded-pill shadow-sm">
        {props.badge || "Учасник клубу BellaPizza"}
      </span>
    </header>
  );
}

export default Header;

