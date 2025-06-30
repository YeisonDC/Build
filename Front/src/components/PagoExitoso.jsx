import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';

const PagoExitoso = () => {
  const location = useLocation();
  const { limpiarCarrito } = useContext(CartContext);

  const [estadoPago, setEstadoPago] = useState(null); // APPROVED, DECLINED, ERROR
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const referencia = query.get('reference');

    const verificarYGuardar = async () => {
      if (!referencia) {
        setEstadoPago('ERROR');
        setCargando(false);
        return;
      }

      try {
        // Paso 1: Verificar estado del pago
        const estadoRes = await API.get(`/checkout/estado-pago/${referencia}`);
        const status = estadoRes.data.status; // "APPROVED", "DECLINED", etc.

        setEstadoPago(status);

        // Paso 2: Solo guardar el pedido si fue aprobado
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
    if (cargando) {
      return <p>Verificando estado de tu transacción...</p>;
    }

    switch (estadoPago) {
      case 'APPROVED':
        return (
          <>
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu transacción fue procesada exitosamente.</p>
          </>
        );
      case 'DECLINED':
        return (
          <>
            <h2>Pago rechazado</h2>
            <p>Tu transacción fue declinada. Intenta con otro método de pago o verifica con tu banco.</p>
          </>
        );
      default:
        return (
          <>
            <h2>Error al verificar el pago</h2>
            <p>No se pudo verificar el estado de la transacción. Si tu dinero fue descontado, contáctanos.</p>
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
