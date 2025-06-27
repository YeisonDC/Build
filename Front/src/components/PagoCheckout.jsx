import React, { useState, useContext, useEffect } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // <-- Añadido para generar session_id

const PagoCheckout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const totalConEnvio = Number(location.state?.totalConEnvio || 0);

  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  // Opcional: mostrar link en vez de redirigir
  // const [checkoutUrl, setCheckoutUrl] = useState('');

  // NUEVO estado para guardar session_id de invitado
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setCorreo(user.email);
    }
  }, [user]);

  // NUEVO: Obtener o crear session_id para usuarios no autenticados
  useEffect(() => {
    let id = localStorage.getItem('session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('session_id', id);
    }
    setSessionId(id);
  }, []);

  const manejarPago = async () => {
    setError('');

    if (!totalConEnvio || totalConEnvio <= 0) {
      setError('No hay total para pagar');
      return;
    }

    if (!correo || !/\S+@\S+\.\S+/.test(correo)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    setCargando(true);
    try {
      // Aquí mandamos session_id si no hay usuario logueado
      const body = {
        valor: totalConEnvio,
        correo,
      };

      if (!user?.id) {
        body.session_id = sessionId;
      }

      const response = await API.post('/crear-checkout', body);
      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirige al link de pago
        // Si quieres mostrar el link en vez de redirigir:
        // setCheckoutUrl(checkoutUrl);
      } else {
        setError('No se pudo obtener el link de pago');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error creando el pago. Intenta de nuevo.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Pagar con Wompi</h2>
      <p>
        Total a pagar:{' '}
        <b>
          {totalConEnvio.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          }) || '0 COP'}
        </b>
      </p>

      {!user?.email && (
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
      )}

      <button onClick={manejarPago} disabled={cargando} style={{ width: '100%', padding: 10 }}>
        {cargando ? 'Generando pago...' : 'Pagar'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar el link (opcional) */}
      {/* checkoutUrl && (
        <p>
          Link de pago: <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">{checkoutUrl}</a>
        </p>
      ) */}
    </div>
  );
};

export default PagoCheckout;
