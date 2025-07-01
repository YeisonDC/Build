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
    const searchParams = new URLSearchParams(location.search);
    const transaccionId = searchParams.get('id');

    console.log('🔍 ID de transacción en URL:', transaccionId);

    const verificarYGuardar = async () => {
      if (!transaccionId) {
        console.error('❌ No se encontró el ID de transacción en la URL');
        setEstadoPago('ERROR');
        setCargando(false);
        return;
      }

      try {
        const estadoRes = await API.get(`/crear-checkout/estado-pago-id/${transaccionId}`);
        const estadoBackend = estadoRes?.data?.status;

        console.log('📦 Respuesta completa del backend:', estadoRes.data);
        console.log('🧪 estadoRes.data.status:', estadoBackend);
        console.log('📘 typeof:', typeof estadoBackend);
        console.log('🧪 JSON.stringify:', JSON.stringify(estadoBackend));

        const statusValido = ['APPROVED', 'DECLINED', 'NOT_FOUND'];
        const status = statusValido.includes(estadoBackend) ? estadoBackend : 'ERROR';

        console.log('✅ Estado interpretado:', status);
        setEstadoPago(status);

        if (status === 'APPROVED') {
          limpiarCarrito();
        }
      } catch (err) {
        console.error('❌ Error verificando el estado del pago:', err);
        setEstadoPago('ERROR');
      } finally {
        setCargando(false);
      }
    };

    verificarYGuardar();
  }, [location.search, limpiarCarrito]);

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

  return <div style={{ padding: 20 }}>{renderMensaje()}</div>;
};

export default PagoExitoso;
