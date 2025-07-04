import React, { useState, useContext, useEffect } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const PagoCheckout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const totalConEnvio = Number(location.state?.totalConEnvio || 0);
  const valorEnvio = Number(location.state?.valorEnvio || 0); // ← ✅ Nuevo valor extraído

  const [sessionId, setSessionId] = useState(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState({
    calle: '',
    ciudad: '',
    departamento: '',
    pais: '',
    codigo_postal: ''
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // ✅ Obtener datos del perfil desde el backend (más completo que el AuthContext)
  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;
      try {
        const res = await API.get('/usuarios/perfil');
        const datos = res.data;

        setNombre(datos.nombre || '');
        setCorreo(datos.correo || '');
        setCelular(datos.telefono || '');

        if (datos.direccion) {
          setDireccion({
            calle: datos.direccion.calle || '',
            ciudad: datos.direccion.ciudad || '',
            departamento: datos.direccion.departamento || '',
            pais: datos.direccion.pais || '',
            codigo_postal: datos.direccion.codigo_postal || ''
          });
        }
      } catch (err) {
        console.error('Error al cargar el perfil del usuario:', err);
      }
    };

    fetchPerfil();
  }, [user]);

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
      const bodyCliente = {
        nombre_cliente: nombre,
        correo_cliente: correo,
        celular_cliente: celular,
        direccion_envio: `${direccion.calle}, ${direccion.ciudad}, ${direccion.departamento}, ${direccion.pais}, ${direccion.codigo_postal}`,
        valor_envio: valorEnvio // ← ✅ Valor del envío ahora viene desde CartPage
      };

      if (!user?.id) {
        bodyCliente.session_id = sessionId;
      }

      // Paso 1: Actualizar los datos del cliente en el carrito
      await API.put('/carrito/actualizar-datos-cliente', bodyCliente);

      // Paso 2: Generar el link de pago
      const body = {
        valor: totalConEnvio,
        correo,
        nombre_cliente: nombre,
        celular_cliente: celular,
        direccion_envio: direccion,
        valor_envio: valorEnvio // ← ✅ También se envía en la creación del checkout
      };

      if (!user?.id) {
        body.session_id = sessionId;
      }

      const response = await API.post('/crear-checkout', body);
      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('No se pudo obtener el link de pago');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error creando el pago');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Pagar con Wompi</h2>
      <p>
        Total a pagar:{' '}
        <b>
          {totalConEnvio.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
          })}
        </b>
      </p>

      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <input
        type="tel"
        placeholder="Número de celular"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <input
        type="text"
        placeholder="Calle / dirección"
        value={direccion.calle}
        onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Ciudad"
        value={direccion.ciudad}
        onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Departamento"
        value={direccion.departamento}
        onChange={(e) => setDireccion({ ...direccion, departamento: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="text"
        placeholder="País"
        value={direccion.pais}
        onChange={(e) => setDireccion({ ...direccion, pais: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="text"
        placeholder="Código postal"
        value={direccion.codigo_postal}
        onChange={(e) => setDireccion({ ...direccion, codigo_postal: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <button onClick={manejarPago} disabled={cargando} style={{ width: '100%', padding: 10 }}>
        {cargando ? 'Generando pago...' : 'Pagar'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PagoCheckout;
