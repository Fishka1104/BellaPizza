import React, { useState } from 'react';

/**
 * Компонент GoodsCard
 * Отримує параметри виключно через props:
 * - props.picture (фото товару)
 * - props.name (назва товару)
 * - props.price (ціна)
 * - props.description (опис/склад)
 * - props.badge (ярлик)
 * - props.onOrder (колбек-функція)
 */
function GoodsCard(props) {
  const { picture, name, price, description, badge, onOrder } = props;
  const [hasError, setHasError] = useState(false);

  return (
    <div className="col-lg-4 col-md-6 col-12 d-flex">
      <div className="card goods-card w-100 border-0 rounded-4 overflow-hidden mb-4 shadow-sm">
        {/* Контейнер фото товару із фіксованою висотою та захистом від перекриття */}
        <div className="goods-img-wrapper position-relative">
          {!hasError ? (
            <img
              src={picture}
              alt={name}
              className="card-img-top goods-card-img"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="goods-placeholder">
              <i className="bi bi-card-image fs-1 text-secondary mb-2"></i>
              <span className="small text-muted fw-semibold">Фото страви тимчасово недоступне</span>
            </div>
          )}

          {badge && (
            <span className="badge goods-badge-react position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm text-white">
              {badge}
            </span>
          )}
        </div>

        {/* Інформація про товар */}
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
            {/* Назва товару (props.name) */}
            <h5 className="card-title fw-bold text-dark mb-0">{name}</h5>

            {/* Ціна товару (props.price) */}
            <span className="badge bg-light text-danger border border-danger-subtle fs-6 px-3 py-2 rounded-pill text-nowrap">
              {price} ₴
            </span>
          </div>

          {/* Опис / інгредієнти */}
          <p className="card-text text-muted flex-grow-1 small mb-4">
            {description}
          </p>

          {/* Кнопка замовлення */}
          <button
            type="button"
            className="btn btn-danger w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
            onClick={() => onOrder && onOrder(name, price)}
          >
            <i className="bi bi-cart-plus"></i>
            <span>Замовити в кошик</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoodsCard;
