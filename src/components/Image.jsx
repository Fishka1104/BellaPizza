import React, { useState } from 'react';

/**
 * Функціональний компонент Image
 * Керування зображенням: збільшення, зменшення, додавання та видалення
 */
function Image(props) {
  const [size, setSize] = useState(150);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleZoomIn = () => {
    if (size < 240) {
      setSize((prevSize) => prevSize + 20);
    }
  };

  const handleZoomOut = () => {
    if (size > 80) {
      setSize((prevSize) => prevSize - 20);
    }
  };

  const handleAdd = () => {
    setIsDeleted(false);
    setSize(150);
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  return (
    <div className="profile-image-container text-center">
      {/* Контейнер зображення */}
      <div
        id="avatar-container"
        className="mb-3 d-flex justify-content-center align-items-center"
        style={{ minHeight: "160px" }}
      >
        {!isDeleted ? (
          <img
            id="profile-avatar-img"
            src={props.src || "images/userphoto.png"}
            alt="Фото профілю"
            className="profile-avatar shadow-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              border: "4px solid #d32f2f",
              objectFit: "cover",
              transition: "width 0.3s ease, height 0.3s ease"
            }}
          />
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center text-muted border border-2 border-dashed rounded-circle bg-light shadow-sm"
            style={{ width: "140px", height: "140px", margin: "0 auto" }}
          >
            <i className="bi bi-person-x fs-1 text-secondary mb-1"></i>
            <span style={{ fontSize: "0.75rem" }}>Фото видалено</span>
          </div>
        )}
      </div>

      {/* Панель кнопок керування */}
      <div className="avatar-controls d-flex flex-wrap justify-content-center gap-2 mb-2">
        <button
          type="button"
          id="btn-add-avatar"
          className="btn btn-sm btn-outline-success"
          onClick={handleAdd}
          title="Додати фото профілю"
        >
          <i className="bi bi-plus-circle me-1"></i>Додати
        </button>
        <button
          type="button"
          id="btn-zoom-in-avatar"
          className="btn btn-sm btn-outline-primary"
          onClick={handleZoomIn}
          disabled={isDeleted || size >= 240}
          title="Збільшити фото"
        >
          <i className="bi bi-zoom-in me-1"></i>Збільшити
        </button>
        <button
          type="button"
          id="btn-zoom-out-avatar"
          className="btn btn-sm btn-outline-secondary"
          onClick={handleZoomOut}
          disabled={isDeleted || size <= 80}
          title="Зменшити фото"
        >
          <i className="bi bi-zoom-out me-1"></i>Зменшити
        </button>
        <button
          type="button"
          id="btn-delete-avatar"
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
          disabled={isDeleted}
          title="Видалити фото"
        >
          <i className="bi bi-trash me-1"></i>Видалити
        </button>
      </div>

      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
        Поточний розмір: <strong>{size}×{size}px</strong>
      </div>
    </div>
  );
}

export default Image;

