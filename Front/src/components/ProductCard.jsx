import React, { useState } from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';

const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_800,h_960,c_fill,dpr_auto,f_auto,q_auto/"
  );
};

const ProductCard = ({ product }) => {
  const hasValidData =
    product &&
    Array.isArray(product.colores) &&
    product.colores.length > 0 &&
    product.precio &&
    product.nombre;

  const [selectedColor, setSelectedColor] = useState(
    hasValidData ? product.colores[0].color : ''
  );

  if (!hasValidData) {
    return <div className="product-card-container">Producto incompleto</div>;
  }

  const selectedColorObj = product.colores.find(c =>
    JSON.stringify(c.color) === JSON.stringify(selectedColor)
  );

  const displayedImage =
    selectedColorObj?.imagenes?.[0] ||
    'https://via.placeholder.com/300x400?text=Sin+imagen';

  return (
    <div className="product-card-container">
      <Link to={`/producto/${product._id}`}>
        <img
          src={mejorarCalidadCloudinary(displayedImage)}
          alt={`${product.nombre} - color ${selectedColor[0]}`}
          className="product-card-image larger"
        />
      </Link>

      <div className="product-card-info">
        <div className="product-card-category-tags">
          {Array.isArray(product.categoria) && product.categoria.length > 0 ? (
            product.categoria.map((cat, i) => (
              <span key={i} className="product-card-category-tag">
                {cat}
              </span>
            ))
          ) : (
            <span className="product-card-category-tag">Sin categoría</span>
          )}
        </div>

        <h3 className="product-card-title">{product.nombre}</h3>

        <div className="product-card-color-dots">
          {product.colores.map((colorObj, index) => (
            <span
              key={index}
              className={`product-card-color-dot ${
                JSON.stringify(selectedColor) === JSON.stringify(colorObj.color)
                  ? 'selected'
                  : ''
              }`}
              style={{ backgroundColor: colorObj.color[1] }}
              onClick={() => setSelectedColor(colorObj.color)}
              title={colorObj.color[0]}
            ></span>
          ))}
        </div>

        <div className="product-card-price-only">
          <p className="product-card-price">
            {product.precio ? `$${product.precio.toLocaleString()}` : 'Precio no disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
