import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../api';

const PagoExitoso = () => {
  const location = useLocation();
  const { limpiarCarrito } = useContext(CartContext);

  const [estadoPago, setEstadoPago] = useState(null); // APPROVED, DECLINED, NOT_FOUND, ERROR
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Extraer el ID de la transacción desde el hash (porque estás usando HashRouter)
    const hashParams = new URLSearchParams(location.hash.split('?')[1]);
    const transaccionId = hashParams.get('id');

    const verificarYGuardar = async () => {
      if (!transaccionId) {
        setEstadoPago('ERROR');
        setCargando(false);
        return;
      }

      try {
        // Paso 1: Obtener estado de la transacción usando el ID
        const estadoRes = await API.get(`/checkout/estado-pago-id/${transaccionId}`);
        const statusValido = ['APPROVED', 'DECLINED', 'NOT_FOUND'];
        const status = statusValido.includes(estadoRes.data.status)
          ? estadoRes.data.status
          : 'ERROR';

        console.log('📦 Estado recibido del backend:', estadoRes.data.status);
        setEstadoPago(status);

        // Paso 2: Solo guardar el pedido si fue aprobado
        if (status === 'APPROVED') {
          const guardarRes = await API.post('/api/guardar-pedido', {
            transaccion_id: transaccionId,
          });
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
      case 'NOT_FOUND':
        return (
          <>
            <h2>No se encontró la transacción</h2>
            <p>No encontramos una transacción con esta referencia. Si el dinero fue descontado, contáctanos.</p>
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
