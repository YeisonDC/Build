import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';

const PagoExitoso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { limpiarCarrito } = useContext(CartContext);

  const [estadoPago, setEstadoPago] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const referencia = query.get('reference');

    const verificarYGuardar = async () => {
      if (!referencia) return;

      try {
        // Paso 1: Verificar el estado del pago
        const estadoRes = await API.get(`/estado-pago/${referencia}`);
        const status = estadoRes.data.status; // 'APPROVED', 'DECLINED', etc.
        setEstadoPago(status);

        if (status === 'APPROVED') {
          // Paso 2: Guardar el pedido
          const guardarRes = await API.post('/api/guardar-pedido', { referencia });

          if (guardarRes.data.success) {
            limpiarCarrito();
          }
        }
      } catch (err) {
        console.error('Error verificando o guardando el pedido:', err);
        setEstadoPago('ERROR');
      } finally {
        setCargando(false);
      }
    };

    verificarYGuardar();
  }, [location]);

  const renderMensaje = () => {
    if (cargando) return <p>Verificando estado de tu transacción...</p>;

    if (estadoPago === 'APPROVED') {
      return (
        <>
          <h2>¡Gracias por tu compra!</h2>
          <p>Tu transacción fue procesada exitosamente.</p>
        </>
      );
    } else if (estadoPago === 'DECLINED') {
      return (
        <>
          <h2>Pago rechazado</h2>
          <p>Tu transacción fue declinada. Por favor intenta nuevamente o usa otro método de pago.</p>
        </>
      );
    } else {
      return (
        <>
          <h2>Error en el pago</h2>
          <p>No pudimos verificar el estado de tu transacción. Si el dinero fue descontado, contáctanos.</p>
        </>
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {renderMensaje()}
    </div>
  );
};

export default PagoExitoso;
