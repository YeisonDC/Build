import React, { useContext, useState } from 'react';
import './ProductCard.css';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_800,h_960,c_fill,dpr_auto,f_auto,q_auto/"
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

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
    return <div className="product-card-container">Producto incompleto</div>;
  }

  const selectedColorObj = product.colores.find(c =>
    JSON.stringify(c.color) === JSON.stringify(selectedColor)
  );

  const selectedSizeObj = selectedColorObj?.tallas?.find(t => t.talla === selectedSize);

  const displayedImage = selectedSizeObj?.imagen
    || selectedColorObj?.imagenes?.[0]
    || 'https://via.placeholder.com/300x400?text=Sin+imagen';

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Selecciona un color y una talla antes de agregar al carrito.');
      return;
    }

    const selectedProduct = {
      id: product._id,
      name: product.nombre,
      price: product.precio,
      color: selectedColor, // 👈 Ahora es un array [nombre, hex]
      size: selectedSize,
      image: selectedSizeObj?.imagen || mejorarCalidadCloudinary(displayedImage)
    };

    addToCart(selectedProduct);
    toast.success('Producto agregado al carrito');
  };

  return (
    <div className="product-card-container">
      <Link to={`/producto/${product._id}`}>
        <img
          src={mejorarCalidadCloudinary(displayedImage)}
          alt={`${product.nombre} - color ${selectedColor[0]} - talla ${selectedSize}`}
          className="product-card-image"
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
              style={{ backgroundColor: colorObj.color[1] }} // hex
              onClick={() => {
                setSelectedColor(colorObj.color);
                setSelectedSize(colorObj.tallas?.[0]?.talla || '');
              }}
              title={colorObj.color[0]} // tooltip nombre color
            ></span>
          ))}
        </div>

        <div className="product-card-size-price-row">
          <div className="product-card-sizes">
            {selectedColorObj?.tallas?.map((tallaObj, index) => (
              <span
                key={index}
                className={`product-card-size-tag ${
                  selectedSize === tallaObj.talla ? 'selected' : ''
                }`}
                onClick={() => setSelectedSize(tallaObj.talla)}
              >
                {tallaObj.talla}
              </span>
            ))}
          </div>
          <p className="product-card-price">
            {product.precio ? `$${product.precio.toLocaleString()}` : 'Precio no disponible'}
          </p>
        </div>

        <button className="product-card-add-btn" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
