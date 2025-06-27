import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { limpiarCarrito } = useContext(CartContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const referencia = query.get('reference');

    const guardarPedido = async () => {
      try {
        const response = await API.post('/api/guardar-pedido', { referencia });
        if (response.data.success) {
          limpiarCarrito(); // Vacía el carrito
        }
      } catch (err) {
        console.error('Error guardando pedido:', err);
      }
    };

    if (referencia) {
      guardarPedido();
    }
  }, [location]);

  return (
    <div style={{ padding: 20 }}>
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu transacción fue procesada exitosamente.</p>
    </div>
  );
};

export default PagoExitoso;
