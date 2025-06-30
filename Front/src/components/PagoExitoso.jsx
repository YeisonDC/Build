import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';

const PagoExitoso = () => {
  const location = useLocation();
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
        const status = estadoRes.data.status; // "APPROVED", "DECLINED", "NOT_FOUND", etc.
        setEstadoPago(status);

        // Paso 2: Si es aprobado, guardar pedido
        if (status === 'APPROVED') {
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
    }

    if (estadoPago === 'DECLINED') {
      return (
        <>
          <h2>Pago rechazado</h2>
          <p>Tu transacción fue declinada. Por favor intenta nuevamente o usa otro método de pago.</p>
        </>
      );
    }

    if (estadoPago === 'NOT_FOUND') {
      return (
        <>
          <h2>No se encontró la transacción</h2>
          <p>No pudimos encontrar una transacción asociada a tu compra. Si crees que es un error y el dinero fue descontado, contáctanos.</p>
        </>
      );
    }

    return (
      <>
        <h2>Error al verificar el pago</h2>
        <p>No se pudo verificar el estado de la transacción. Si tu dinero fue descontado, contáctanos.</p>
      </>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      {renderMensaje()}
    </div>
  );
};

export default PagoExitoso;
