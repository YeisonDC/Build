import React, { useState } from 'react';
import './ProductEditCard.css';
import { useNavigate } from 'react-router-dom';

const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_800,h_960,c_fill,dpr_auto,f_auto,q_auto/"
  );
};

const ProductEditCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  const hasValidData =
    product &&
    Array.isArray(product.colores) &&
    product.colores.length > 0 &&
    product.precio &&
    product.nombre;

  const [selectedColor, setSelectedColor] = useState(
    hasValidData ? product.colores[0].color : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    hasValidData ? product.colores[0]?.tallas?.[0]?.talla || '' : ''
  );

  if (!hasValidData) {
    return <div className="edit-product-card">Producto incompleto</div>;
  }

  const selectedColorObj = product.colores.find(c =>
    JSON.stringify(c.color) === JSON.stringify(selectedColor)
  );

  const selectedSizeObj = selectedColorObj?.tallas?.find(t => t.talla === selectedSize);

  const displayedImage = selectedSizeObj?.imagen
    || selectedColorObj?.imagenes?.[0]
    || 'https://via.placeholder.com/300x400?text=Sin+imagen';

  const handleEdit = () => {
    navigate(`/editar-producto/${product._id}`);
  };

  const handleDelete = () => {
    // Aquí llamamos directo a onDelete que abrirá el modal en ProductEdit.jsx
    onDelete(product._id);
  };

  return (
    <div className="edit-product-card">
      <img
        src={mejorarCalidadCloudinary(displayedImage)}
        alt={`${product.nombre} - color ${selectedColor[0]} - talla ${selectedSize}`}
        className="edit-product-image"
      />

      <div className="edit-card-info">
        <div className="edit-category-tags">
          {Array.isArray(product.categoria) && product.categoria.length > 0 ? (
            product.categoria.map((cat, i) => (
              <span key={i} className="edit-category-tag">
                {cat}
              </span>
            ))
          ) : (
            <span className="edit-category-tag">Sin categoría</span>
          )}
        </div>

        <h3>{product.nombre}</h3>

        <div className="edit-color-dots">
          {product.colores.map((colorObj, index) => (
            <span
              key={index}
              className={`edit-color-dot ${JSON.stringify(selectedColor) === JSON.stringify(colorObj.color) ? 'selected' : ''}`}
              style={{ backgroundColor: colorObj.color[1] }}
              onClick={() => {
                setSelectedColor(colorObj.color);
                setSelectedSize(colorObj.tallas?.[0]?.talla || '');
              }}
              title={colorObj.color[0]}
            ></span>
          ))}
        </div>

        <div className="edit-size-price-row">
          <div className="edit-sizes">
            {selectedColorObj?.tallas?.map((tallaObj, index) => (
              <span
                key={index}
                className={`edit-size-tag ${selectedSize === tallaObj.talla ? 'selected' : ''}`}
                onClick={() => setSelectedSize(tallaObj.talla)}
              >
                {tallaObj.talla}
              </span>
            ))}
          </div>
          <p className="edit-price">
            {product.precio ? `$${product.precio.toLocaleString()}` : 'Precio no disponible'}
          </p>
        </div>

        <div className="edit-btn-row">
          <button className="edit-btn" onClick={handleEdit}>Editar</button>
          <button className="delete-btn" onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditCard;
