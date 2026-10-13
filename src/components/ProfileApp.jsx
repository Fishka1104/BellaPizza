import React from 'react';
import Header from './Header';
import Image from './Image';
import Content from './Content';

/**
 * Головний компонент профілю
 * Поєднує Header (function) Image (function) та Content (class)
 */
function ProfileApp(props) {
  const userName = props.userName || localStorage.getItem("userName") || "Бондаренко Ілля Олександрович";
  const userEmail = props.userEmail || localStorage.getItem("userEmail") || "student@kpi.ua";

  return (
    <div className="react-profile-wrapper shadow-sm text-center">
      {/* 1. Функціональний компонент Header */}
      <Header
        title="Особистий профіль"
        badge="React Component"
      />

      {/* 2. Функціональний компонент Image */}
      <Image src="images/userphoto.png" />

      {/* 3. Класовий компонент Content */}
      <Content
        name={userName}
        email={userEmail}
      />
    </div>
  );
}

export default ProfileApp;

