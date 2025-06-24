import React, { useState, useEffect } from 'react';
import './ProductPreview.css';

// Icono placeholder simple en SVG (puedes cambiarlo por tu logo o imagen)
const PlaceholderIcon = () => (
  <div className="product-preview-img placeholder-container">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="product-preview-placeholder-icon"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="300" height="400" fill="#ddd" />
      <path
        d="M75 150 L225 150 L225 250 L75 250 Z"
        stroke="#999"
        strokeWidth="5"
        fill="none"
      />
      <circle cx="150" cy="200" r="25" stroke="#999" strokeWidth="5" fill="none" />
      <line x1="75" y1="300" x2="225" y2="300" stroke="#999" strokeWidth="5" />
    </svg>
  </div>
);

// Mejora la calidad de la imagen en Cloudinary agregando parámetros
const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_800,h_960,c_fill,dpr_auto,f_auto,q_auto/"
  );
};

const ProductPreview = ({ product }) => {
  // Ya no validamos estrictamente hasValidData para permitir vista previa incluso con datos incompletos

  // Valores por defecto para evitar errores y mostrar placeholders si falta info
  // NOTA: definición de colores se hace dentro del useEffect para evitar warning de dependencias

  const nombre = product?.nombre || 'Nombre no disponible';

  const categoria = Array.isArray(product?.categoria) && product.categoria.length > 0
    ? product.categoria
    : ['Sin categoría'];

  const precio = product?.precio || 0;

  // Estados para color y talla seleccionados, inicializados con valores por defecto
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const colores = Array.isArray(product?.colores) && product.colores.length > 0
      ? product.colores
      : [{ color: ['Sin color', '#ccc'], imagenes: [''], tallas: [{ talla: '-', stock: 0, imagen: '' }] }];

    setSelectedColor(colores[0].color[1]);
    setSelectedSize(colores[0].tallas?.[0]?.talla || '');
  }, [product]);

  // Para renderizar, definimos colores aquí porque ya no es estado
  const colores = Array.isArray(product?.colores) && product.colores.length > 0
    ? product.colores
    : [{ color: ['Sin color', '#ccc'], imagenes: [''], tallas: [{ talla: '-', stock: 0, imagen: '' }] }];

  // Buscamos los objetos de color y talla seleccionados, con fallback a primer elemento
  const selectedColorObj = colores.find(c => c.color[1] === selectedColor) || colores[0];
  const selectedSizeObj = selectedColorObj?.tallas?.find(t => t.talla === selectedSize) || selectedColorObj.tallas[0];

  // Imagen a mostrar: la de talla seleccionada, si existe, sino la primera del color, sino placeholder
  const rawImage = selectedSizeObj?.imagen
    ? selectedSizeObj.imagen
    : (selectedColorObj?.imagenes?.[0]
      ? selectedColorObj.imagenes[0]
      : '');

  const displayedImage = rawImage ? mejorarCalidadCloudinary(rawImage) : '';

  return (
    <div className="product-preview-card">
      {displayedImage ? (
        <img
          src={displayedImage}
          alt={`${nombre} - color ${selectedColor} - talla ${selectedSize}`}
          className="product-preview-img"
        />
      ) : (
        <PlaceholderIcon />
      )}

      <div className="product-preview-info">
        <div className="product-preview-category-tags">
          {categoria.map((cat, i) => (
            <span key={i} className="product-preview-category-tag">
              {cat}
            </span>
          ))}
        </div>

        <h3>{nombre}</h3>

        <div className="product-preview-color-dots">
          {colores.map((colorObj, index) => (
            <span
              key={index}
              className={`product-preview-color-dot ${selectedColor === colorObj.color[1] ? 'selected' : ''}`}
              style={{ backgroundColor: colorObj.color[1] }}
              onClick={() => {
                setSelectedColor(colorObj.color[1]);
                setSelectedSize(colorObj.tallas?.[0]?.talla || '');
              }}
            ></span>
          ))}
        </div>

        <div className="product-preview-size-price-row">
          <div>
            {selectedColorObj?.tallas?.map((tallaObj, index) => (
              <span
                key={index}
                className={`product-preview-size-tag ${selectedSize === tallaObj.talla ? 'selected' : ''}`}
                onClick={() => setSelectedSize(tallaObj.talla)}
              >
                {tallaObj.talla}
              </span>
            ))}
          </div>
          <p className="product-preview-price">
            {precio
              ? `$${Number(precio).toLocaleString('es-CO')}`
              : 'Precio no disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
