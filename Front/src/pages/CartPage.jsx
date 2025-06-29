// Importamos React, hooks y contexto del carrito
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext'; // Traemos el contexto para manejar el carrito
import { FiTrash2 } from 'react-icons/fi'; // Icono de basurero
import { Link, useNavigate } from 'react-router-dom'; // IMPORTAR Link y useNavigate para navegación
import ShippingBox from '../components/ShippingBox'; // Componente de opciones de envío
import { toast } from 'react-toastify'; // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Estilos para el toast

// 🔥 Versión mejorada para optimizar calidad según tamaño real del CartPage
const mejorarCalidadCloudinary = (url, width = 200, height = 260) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Parámetros para ajustar tamaño, calidad automática, formato y dpi (para nitidez)
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,dpr_auto,f_auto,q_auto/`
  );
};

const CartPage = () => {
  // Extraemos del contexto los items del carrito y las funciones
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  // Hook para navegar a otras rutas
  const navigate = useNavigate();

  // Manejamos un estado local para controlar las cantidades
  const [cantidades, setCantidades] = useState(
    cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.color}-${item.size}`; // Clave única por ID + color + talla
      acc[key] = item.quantity;
      return acc;
    }, {})
  );

  // Si el carrito cambia, sincronizamos las cantidades
  useEffect(() => {
    const nuevasCantidades = cartItems.reduce((acc, item) => {
      const key = `${item.id}-${item.color}-${item.size}`;
      acc[key] = item.quantity;
      return acc;
    }, {});
    setCantidades(nuevasCantidades);
  }, [cartItems]);

  // Maneja el cambio de cantidad en el input
  const handleCantidadChange = (key, producto) => (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) value = 1; // Evita valores inválidos

    setCantidades(prev => ({ ...prev, [key]: value }));
    updateQuantity(producto.id, producto.color, producto.size, value);
  };

  // Modificamos la función para mostrar notificación al eliminar producto
  const handleRemoveFromCart = (id, color, size) => {
    removeFromCart(id, color, size);
    toast.success('Producto eliminado del carrito', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // ✅ El precio ya viene calculado (price * quantity), así que solo sumamos directamente
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  const totalProductos = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Estado para el envío seleccionado
  const [envio, setEnvio] = useState({
    tipo: 'bga',
    costo: 8000,
    descripcion: '1-2 días hábiles',
  });

  // Calculamos el costo de envío automáticamente según el total
  // Si total >= 300000 envío gratis (0), sino el costo según el tipo seleccionado
  const costoEnvioCalculado = total >= 300000 ? 0 : envio.costo;

  return (
    <div style={{
      backgroundColor: '#f4efff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      padding: '2rem',
      fontFamily: 'Rubik, sans-serif',
      gap: '2rem'
    }}>
      {/* COLUMNA IZQUIERDA: Lista de productos */}
      <div style={{
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxHeight: '80vh',
        overflowY: 'auto',
        paddingRight: '1rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#2c2c2c'
        }}>
          Carrito de Compras
        </h2>

        {/* Mostrar mensaje si no hay productos */}
        {cartItems.length === 0 ? (
          <p style={{ fontSize: '1.2rem' }}>Tu carrito está vacío.</p>
        ) : (
          // Recorrer y mostrar cada producto
          cartItems.map((item) => {
            const key = `${item.id}-${item.color}-${item.size}`;
            const colorMostrado = Array.isArray(item.color) ? item.color[0] : item.color;

            return (
              <div key={key} style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '1.2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                {/* Imagen del producto con Link y calidad mejorada */}
                <Link to={`/producto/${item.id}`}>
                  <img
                    src={mejorarCalidadCloudinary(item.image || 'https://via.placeholder.com/100', 200, 260)}
                    alt={item.name}
                    style={{
                      width: '110px',
                      height: '150px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                    }}
                  />
                </Link>

                {/* Información del producto */}
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.2rem'
                  }}>{item.name}</h4>

                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>Color:</strong> {colorMostrado}
                  </p>
                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>Talla:</strong> {item.size}
                  </p>

                  {/* Cantidad con input */}
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <label><strong>Cantidad:</strong></label>
                    <input
                      type="number"
                      min="1"
                      value={cantidades[key] || 1}
                      onChange={handleCantidadChange(key, item)}
                      style={{
                        width: '60px',
                        padding: '0.4rem',
                        borderRadius: '6px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </div>
                </div>

                {/* Precio y botón de eliminar */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    ${item.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleRemoveFromCart(item.id, item.color, item.size)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#c0392b',
                      marginTop: '0.5rem'
                    }}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COLUMNA DERECHA: Resumen del pedido */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        height: 'fit-content',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '2rem',
        alignSelf: 'flex-start'
      }}>
        <h3 style={{
          marginBottom: '1rem',
          fontSize: '1.4rem'
        }}>
          Resumen del Pedido
        </h3>
        <p><strong>Productos:</strong> {totalProductos}</p>

        {/* 🧊 Componente de opciones de envío */}
        <ShippingBox envioActual={envio} onCambioEnvio={setEnvio} total={total} />

        {/* Total con costo de envío */}
        <p><strong>Envío:</strong> ${costoEnvioCalculado.toLocaleString()}</p>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem'
        }}>
          <strong>Total:</strong> ${(total + costoEnvioCalculado).toLocaleString()}
        </p>

        {/* Botón de proceder al pago */}
        <button
          style={{
            width: '100%',
            padding: '0.8rem',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#000000',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}

          onMouseEnter={e => e.currentTarget.style.background = '#333'}
          onMouseLeave={e => e.currentTarget.style.background = '#000000'}

          onClick={() => navigate('/pago', {
            state: {
              totalConEnvio: total + costoEnvioCalculado,
              valorEnvio: costoEnvioCalculado // ← ✅ nuevo valor enviado al checkout
            }
          })} // Aquí redirige al checkout con Wompi
        >
          Ir a Pagar
        </button>
      </div>
    </div>
  );
};

export default CartPage;
