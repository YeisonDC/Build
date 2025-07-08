// src/pages/CartPage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import ShippingBox from '../components/ShippingBox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CartPage.css';

const mejorarCalidadCloudinary = (url, width = 200, height = 260) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,dpr_auto,f_auto,q_auto/`
  );
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const [cantidades, setCantidades] = useState(
    cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.color}-${item.size}`;
      acc[key] = item.quantity;
      return acc;
    }, {})
  );

  useEffect(() => {
    const nuevasCantidades = cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.color}-${item.size}`;
      acc[key] = item.quantity;
      return acc;
    }, {});
    setCantidades(nuevasCantidades);
  }, [cartItems]);

  const handleCantidadChange = (key, producto) => (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1;

    setCantidades(prev => ({ ...prev, [key]: value }));
    updateQuantity(producto.id, producto.color, producto.size, value);
  };

  const handleRemoveFromCart = (id, color, size) => {
    removeFromCart(id, color, size);
    toast.success('Producto eliminado del carrito', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const totalProductos = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [envio, setEnvio] = useState({
    tipo: 'bga',
    costo: 8000,
    descripcion: '1-2 días hábiles',
  });

  const [cuponAplicado, setCuponAplicado] = useState({ descuento: 0, codigo: '' });

  const manejarCupon = (descuento, codigo) => {
    setCuponAplicado({ descuento, codigo });
  };

  const costoEnvioCalculado = total >= 300000 ? 0 : envio.costo;
  const totalConDescuento = total * (1 - cuponAplicado.descuento / 100);
  const totalFinal = totalConDescuento + costoEnvioCalculado;

  return (
    <div className="cartpage-container">
      {/* Columna izquierda */}
      <div className="cartpage-left">
        <h2>Carrito de Compras</h2>

        {cartItems.length === 0 ? (
          <p className="cartpage-empty-msg">Tu carrito está vacío.</p>
        ) : (
          cartItems.map((item) => {
            const key = `${item.id}-${item.color}-${item.size}`;
            const colorMostrado = Array.isArray(item.color) ? item.color[0] : item.color;

            return (
              <div key={key} className="cartpage-product">
                <Link to={`/producto/${item.id}`}>
                  <img
                    src={mejorarCalidadCloudinary(item.image || 'https://via.placeholder.com/100', 200, 260)}
                    alt={item.name}
                    className="cartpage-product-img"
                  />
                </Link>

                <div className="cartpage-product-info">
                  <h4>{item.name}</h4>
                  <p><strong>Color:</strong> {colorMostrado}</p>
                  <p><strong>Talla:</strong> {item.size}</p>

                  <div className="cartpage-quantity">
                    <label><strong>Cantidad:</strong></label>
                    <input
                      type="number"
                      min="1"
                      value={cantidades[key] || 1}
                      onChange={handleCantidadChange(key, item)}
                    />
                  </div>
                </div>

                <div className="cartpage-price-remove">
                  <p>${item.price.toLocaleString()}</p>
                  <button
                    className="cartpage-remove-btn"
                    onClick={() => handleRemoveFromCart(item.id, item.color, item.size)}
                    aria-label="Eliminar producto"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Columna derecha */}
      <div className="cartpage-summary">
        <h3>Resumen del Pedido</h3>
        <p><strong>Productos:</strong> {totalProductos}</p>

        <ShippingBox
          envioActual={envio}
          onCambioEnvio={setEnvio}
          total={total}
          onCuponAplicado={manejarCupon}
        />

        <p><strong>Envío:</strong> ${costoEnvioCalculado.toLocaleString()}</p>

        {cuponAplicado.descuento > 0 && (
          <p style={{ color: 'green' }}>
            <strong>Descuento:</strong> -{cuponAplicado.descuento}% aplicado
          </p>
        )}

        <p className="total"><strong>Total:</strong> ${totalFinal.toLocaleString()}</p>

        <button
          className="cartpage-pay-btn"
          onClick={() =>
            navigate('/pago', {
              state: {
                totalConEnvio: totalFinal,
                valorEnvio: costoEnvioCalculado,
                cupon: cuponAplicado.codigo || null,
              },
            })
          }
        >
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};

export default CartPage;
