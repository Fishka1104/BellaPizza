import React, { useState } from 'react';
import GoodsCard from './GoodsCard';

/**
 * Галерея товарів на основі компонента GoodsCard
 * Передає параметри для кожної піци через props
 */
function GoodsGallery() {
  const [orderedItem, setOrderedItem] = useState(null);

  // Масив з 6 фірмових піц для галереї товарів (з перевіреними шляхами до зображень)
  const pizzaGoods = [
    {
      id: 1,
      name: "Піца Маргарита Класична",
      price: 219,
      picture: "images/Margarita.jpg",
      description: "Соус помодоро зі стиглих томатів Сан-Марцано, справжня моцарела фйор ді латте, свіжий базилік, оливкова олія Extra Virgin.",
      badge: "Хіт продажів"
    },
    {
      id: 2,
      name: "Піца Пепероні Пікантна",
      price: 259,
      picture: "images/slide/peperoni.jpg",
      description: "Італійська салямі пепероні, подвійна моцарела, томатний соус, пластівці перцю чилі та орегано.",
      badge: "Топ вибір"
    },
    {
      id: 3,
      name: "Піца Чотири Сири (Quattro Formaggi)",
      price: 289,
      picture: "images/pizza4sira.jpg",
      description: "Вишукане поєднання чотирьох сирів: вершкова моцарела, пікантна горгонзола, ніжний емменталь та витриманий пармезан.",
      badge: "Шеф-рецепт"
    },
    {
      id: 4,
      name: "Піца Карбонара Аль Форно",
      price: 269,
      picture: "images/dinner/farhad-ibrahimzade-isHUj3N0194-unsplash.jpg",
      description: "Хрусткий бекон панчета, вершковий соус, моцарела, яєчний жовток, свіжозмелений чорний перець та пармезан.",
      badge: "Новинка"
    },
    {
      id: 5,
      name: "Піца Діабло Вогняна",
      price: 279,
      picture: "images/dinner/farhad-ibrahimzade-ZipYER3NLhY-unsplash.jpg",
      description: "Гостра італійська салямі сп'яната, халапеньйо, моцарела, соус барбекю та червона цибуля.",
      badge: "Hot & Spicy"
    },
    {
      id: 6,
      name: "Піца BBQ з куркою та беконом",
      price: 269,
      picture: "images/dinner/keriliwi-c3mFafsFz2w-unsplash.jpg",
      description: "Ніжне куряче філе гриль, копчений бекон, карамелізована цибуля, авторський димний соус BBQ та соковита моцарела.",
      badge: "Популярна"
    }
  ];

  const handleOrder = (name, price) => {
    setOrderedItem({ name, price });
    if (typeof showToast === "function") {
      showToast(`«${name}» додано до замовлення! (${price} ₴)`, "success");
    } else {
      alert(`«${name}» додано до замовлення! (${price} ₴)`);
    }
  };

  return (
    <div className="goods-gallery-container">
      {orderedItem && (
        <div className="alert alert-success alert-dismissible fade show text-center mb-4 shadow-sm" role="alert">
          <i className="bi bi-check2-circle me-2 fs-5"></i>
          Ви замовили: <strong>{orderedItem.name}</strong> за ціною <strong>{orderedItem.price} ₴</strong>!
          <button type="button" className="btn-close" onClick={() => setOrderedItem(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Галерея з 6 товарів на основі GoodsCard */}
      <div className="row g-4 justify-content-center">
        {pizzaGoods.map((item) => (
          <GoodsCard
            key={item.id}
            picture={item.picture}
            name={item.name}
            price={item.price}
            description={item.description}
            badge={item.badge}
            onOrder={handleOrder}
          />
        ))}
      </div>
    </div>
  );
}

export default GoodsGallery;
