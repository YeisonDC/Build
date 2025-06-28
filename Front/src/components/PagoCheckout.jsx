import React, { useState, useContext, useEffect } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const PagoCheckout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const totalConEnvio = Number(location.state?.totalConEnvio || 0);

  const [sessionId, setSessionId] = useState(null);

  // Datos cliente
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

  // Para manejar valor de envío (p.ej. desde ShippingBox)
  const [valorEnvio, setValorEnvio] = useState(0);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Cargar session_id o crear si no existe
  useEffect(() => {
    let id = localStorage.getItem('session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('session_id', id);
    }
    setSessionId(id);
  }, []);

  // Cargar datos del usuario y carrito al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Si usuario logueado, precargar datos desde user context
        if (user) {
          setNombre(user.nombre || '');
          setCorreo(user.correo || user.email || ''); // según como tengas el campo correo/email en user
          setCelular(user.telefono || '');
          if (user.direccion) {
            setDireccion({
              calle: user.direccion.calle || '',
              ciudad: user.direccion.ciudad || '',
              departamento: user.direccion.departamento || '',
              pais: user.direccion.pais || '',
              codigo_postal: user.direccion.codigo_postal || ''
            });
          }
        }

        // Traer carrito (sea con cliente_id o session_id)
        const params = user ? {} : { session_id };
        const res = await API.get('/carrito', { params });

        if (res.data && res.data.nombre_cliente) setNombre(res.data.nombre_cliente);
        if (res.data && res.data.correo_cliente) setCorreo(res.data.correo_cliente);
        if (res.data && res.data.celular_cliente) setCelular(res.data.celular_cliente);

        if (res.data && res.data.direccion_envio) {
          setDireccion(prev => ({
            ...prev,
            ...res.data.direccion_envio
          }));
        }

        if (res.data && res.data.valor_envio !== undefined) {
          setValorEnvio(res.data.valor_envio);
        }
      } catch (err) {
        console.error('Error al cargar datos del carrito:', err);
      }
    }

    cargarDatos();
  }, [user, sessionId]);

  // Actualizar datos en el carrito backend cada vez que cambien los campos del formulario
  useEffect(() => {
    // Evitar llamadas si ni sessionId ni user están definidos aún
    if (!sessionId && !user) return;

    // Pequeño debounce para evitar llamar en cada tecla
    const timeout = setTimeout(async () => {
      try {
        const body = {
          nombre_cliente: nombre,
          correo_cliente: correo,
          celular_cliente: celular,
          direccion_envio: direccion,
          valor_envio: valorEnvio,
        };
        if (user) {
          // No se envía session_id si está logueado
          await API.put('/carrito/actualizar-datos-cliente', body);
        } else {
          // Si no está logueado enviamos session_id
          await API.put('/carrito/actualizar-datos-cliente', { ...body, session_id: sessionId });
        }
      } catch (err) {
        console.error('Error actualizando datos en carrito:', err);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [nombre, correo, celular, direccion, valorEnvio, sessionId, user]);

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
      const body = {
        valor: totalConEnvio,
        correo,
        nombre_cliente: nombre,
        celular_cliente: celular,
        direccion_envio: direccion
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
