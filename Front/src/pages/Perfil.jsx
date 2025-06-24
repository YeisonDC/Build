import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Perfil.css';
import { FiUser, FiShoppingBag, FiSettings, FiPlusSquare, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obtenerRol } from '../services/token';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const { user } = useContext(AuthContext);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [subSeccionConfig, setSubSeccionConfig] = useState('perfil');

  const rol = obtenerRol();

  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: '',
    documento: '',
    fecha_nacimiento: '',
    telefono: '',
  });

  const [formCorreo, setFormCorreo] = useState({
    nuevoCorreo: '',
    contraseñaActual: '',
  });

  const [formContrasena, setFormContrasena] = useState({
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarNuevaContraseña: '',
  });

  const [formDireccion, setFormDireccion] = useState({
    calle: '',
    ciudad: '',
    departamento: '',
    pais: '',
    codigo_postal: '',
  });

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'No registrada';
    const fecha = new Date(fechaISO);
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) return;

      try {
        const respuesta = await API.get('/usuarios/perfil');
        setDatosPerfil(respuesta.data);

        setFormulario({
          nombre: respuesta.data.nombre || '',
          documento: respuesta.data.documento || '',
          fecha_nacimiento: respuesta.data.fecha_nacimiento
            ? respuesta.data.fecha_nacimiento.slice(0, 10)
            : '',
          telefono: respuesta.data.telefono || '',
        });

        setFormCorreo(c => ({ ...c, nuevoCorreo: respuesta.data.correo || '' }));

        setFormDireccion({
          calle: respuesta.data.direccion?.calle || '',
          ciudad: respuesta.data.direccion?.ciudad || '',
          departamento: respuesta.data.direccion?.departamento || '',
          pais: respuesta.data.direccion?.pais || '',
          codigo_postal: respuesta.data.direccion?.codigo_postal || '',
        });

      } catch (err) {
        console.error(err);
        setError('Error al cargar el perfil');
      } finally {
        setCargando(false);
      }
    };

    fetchPerfil();
  }, [user]);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCorreo = (e) => {
    setFormCorreo({
      ...formCorreo,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeContrasena = (e) => {
    setFormContrasena({
      ...formContrasena,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDireccion = (e) => {
    setFormDireccion({
      ...formDireccion,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarCambios = async () => {
    try {
      const respuesta = await API.put(`/usuarios/perfil/${datosPerfil._id}`, formulario);
      toast.success('Cambios guardados correctamente');
      setDatosPerfil(respuesta.data.usuario);
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al guardar los cambios');
    }
  };

  const handleGuardarCorreo = async () => {
    if (!formCorreo.nuevoCorreo || !formCorreo.contraseñaActual) {
      toast.error('Por favor, completa todos los campos para cambiar el correo.');
      return;
    }

    try {
      const respuesta = await API.put(`/usuarios/cambiar-correo/${datosPerfil._id}`, {
        nuevoCorreo: formCorreo.nuevoCorreo,
        contraseñaActual: formCorreo.contraseñaActual,
      });
      toast.success(respuesta.data.mensaje);
      setDatosPerfil(d => ({ ...d, correo: formCorreo.nuevoCorreo }));
      setFormCorreo(c => ({ ...c, contraseñaActual: '' }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.mensaje || 'Error al cambiar correo');
    }
  };

  const handleGuardarContrasena = async () => {
    const { contraseñaActual, nuevaContraseña, confirmarNuevaContraseña } = formContrasena;
    if (!contraseñaActual || !nuevaContraseña || !confirmarNuevaContraseña) {
      toast.error('Por favor, completa todos los campos para cambiar la contraseña.');
      return;
    }
    if (nuevaContraseña !== confirmarNuevaContraseña) {
      toast.error('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const respuesta = await API.put(`/usuarios/cambiar-contrasena/${datosPerfil._id}`, {
        contraseñaActual,
        nuevaContraseña,
        confirmarNuevaContraseña,
      });
      toast.success(respuesta.data.mensaje);
      setFormContrasena({
        contraseñaActual: '',
        nuevaContraseña: '',
        confirmarNuevaContraseña: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.mensaje || 'Error al cambiar contraseña');
    }
  };

  const handleGuardarDireccion = async () => {
    try {
      const respuesta = await API.put(`/usuarios/editar-direccion/${datosPerfil._id}`, formDireccion);
      toast.success(respuesta.data.mensaje || 'Dirección actualizada correctamente');
      setDatosPerfil(d => ({ ...d, direccion: formDireccion }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.mensaje || 'Error al actualizar dirección');
    }
  };

  const renderContenido = () => {
    if (cargando) return <p>Cargando datos del perfil...</p>;
    if (error) return <p>{error}</p>;
    if (!datosPerfil) return <p>No se encontraron datos.</p>;

    if (seccionActiva === 'perfil') {
      const direccion = datosPerfil.direccion || {};
      return (
        <div className="perfil-info">
          <h2>Información del perfil</h2>
          <div className="bloque-datos">
            <div className="grupo">
              <p><strong>Nombre:</strong> {datosPerfil.nombre}</p>
              <p><strong>Correo:</strong> {datosPerfil.correo}</p>
              <p><strong>Documento:</strong> {datosPerfil.documento || 'No especificado'}</p>
            </div>
            <div className="grupo">
              <p><strong>Fecha de nacimiento:</strong> {formatearFecha(datosPerfil.fecha_nacimiento)}</p>
              <p><strong>Teléfono:</strong> {datosPerfil.telefono || 'No registrado'}</p>
            </div>
          </div>

          <h3>Dirección de envío</h3>
          <div className="bloque-direccion">
            <div className="grupo">
              <p><strong>Calle:</strong> {direccion.calle || 'No especificada'}</p>
              <p><strong>Ciudad:</strong> {direccion.ciudad || 'No especificada'}</p>
              <p><strong>Departamento:</strong> {direccion.departamento || 'No especificado'}</p>
            </div>
            <div className="grupo">
              <p><strong>País:</strong> {direccion.pais || 'No especificado'}</p>
              <p><strong>Código Postal:</strong> {direccion.codigo_postal || 'No especificado'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (seccionActiva === 'pedidos') return <p>Aquí irán los pedidos del usuario.</p>;

    if (seccionActiva === 'configuracion') {
      return (
        <div>
          <h2>Configuración de la cuenta</h2>
          <div className="sub-menu">
            <button onClick={() => setSubSeccionConfig('perfil')} className={subSeccionConfig === 'perfil' ? 'active' : ''}>Perfil</button>
            <button onClick={() => setSubSeccionConfig('contraseña')} className={subSeccionConfig === 'contraseña' ? 'active' : ''}>Contraseña</button>
            <button onClick={() => setSubSeccionConfig('correo')} className={subSeccionConfig === 'correo' ? 'active' : ''}>Correo</button>
            <button onClick={() => setSubSeccionConfig('envios')} className={subSeccionConfig === 'envios' ? 'active' : ''}>Envios</button>
          </div>

          {subSeccionConfig === 'perfil' && (
            <div>
              <h3>Editar información del perfil</h3>
              <label>
                Nombre:
                <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} />
              </label>
              <label>
                Documento:
                <input type="text" name="documento" value={formulario.documento} onChange={handleChange} />
              </label>
              <label>
                Fecha de nacimiento:
                <input type="date" name="fecha_nacimiento" value={formulario.fecha_nacimiento} onChange={handleChange} />
              </label>
              <label>
                Teléfono:
                <input type="text" name="telefono" value={formulario.telefono} onChange={handleChange} />
              </label>
              <button onClick={handleGuardarCambios}>Guardar cambios</button>
            </div>
          )}

          {subSeccionConfig === 'contraseña' && (
            <div>
              <h3>Cambiar contraseña</h3>
              <label>
                Contraseña actual:
                <input type="password" name="contraseñaActual" value={formContrasena.contraseñaActual} onChange={handleChangeContrasena} />
              </label>
              <label>
                Nueva contraseña:
                <input type="password" name="nuevaContraseña" value={formContrasena.nuevaContraseña} onChange={handleChangeContrasena} />
              </label>
              <label>
                Confirmar nueva contraseña:
                <input type="password" name="confirmarNuevaContraseña" value={formContrasena.confirmarNuevaContraseña} onChange={handleChangeContrasena} />
              </label>
              <button onClick={handleGuardarContrasena}>Guardar nueva contraseña</button>
            </div>
          )}

          {subSeccionConfig === 'correo' && (
            <div>
              <h3>Cambiar correo electrónico</h3>
              <label>
                Nuevo correo:
                <input type="email" name="nuevoCorreo" value={formCorreo.nuevoCorreo} onChange={handleChangeCorreo} />
              </label>
              <label>
                Contraseña actual:
                <input type="password" name="contraseñaActual" value={formCorreo.contraseñaActual} onChange={handleChangeCorreo} />
              </label>
              <button onClick={handleGuardarCorreo}>Guardar nuevo correo</button>
            </div>
          )}

          {subSeccionConfig === 'envios' && (
            <div>
              <h3>Editar información de envío</h3>
              <label>
                Dirección:
                <input type="text" name="calle" value={formDireccion.calle} onChange={handleChangeDireccion} />
              </label>
              <label>
                Ciudad:
                <input type="text" name="ciudad" value={formDireccion.ciudad} onChange={handleChangeDireccion} />
              </label>
              <label>
                Departamento:
                <input type="text" name="departamento" value={formDireccion.departamento} onChange={handleChangeDireccion} />
              </label>
              <label>
                País:
                <input type="text" name="pais" value={formDireccion.pais} onChange={handleChangeDireccion} />
              </label>
              <label>
                Código Postal:
                <input type="text" name="codigo_postal" value={formDireccion.codigo_postal} onChange={handleChangeDireccion} />
              </label>
              <button onClick={handleGuardarDireccion}>Guardar dirección</button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <button onClick={() => setSeccionActiva('perfil')} className={seccionActiva === 'perfil' ? 'active' : ''}>
          <FiUser style={{ marginRight: '8px' }} />
          Perfil
        </button>
        <button onClick={() => setSeccionActiva('pedidos')} className={seccionActiva === 'pedidos' ? 'active' : ''}>
          <FiShoppingBag style={{ marginRight: '8px' }} />
          Pedidos
        </button>
        <button onClick={() => setSeccionActiva('configuracion')} className={seccionActiva === 'configuracion' ? 'active' : ''}>
          <FiSettings style={{ marginRight: '8px' }} />
          Configuración
        </button>

        {rol === 'ADMIN' && (
          <>
            <button
              className="btn-admin"
              onClick={() => navigate('/crear-producto')}
              style={{ display: 'block', width: '100%', marginTop: '20px', marginBottom: '10px', textAlign: 'left' }}
            >
              <FiPlusSquare style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Crear artículo
            </button>
            <button
              className="btn-admin"
              onClick={() => navigate('/admin/productos')}
              style={{ display: 'block', width: '100%', textAlign: 'left' }}
            >
              <FiList style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Todos los artículos
            </button>
          </>
        )}
      </aside>

      <section className="perfil-contenido">
        {renderContenido()}
      </section>
    </div>
  );
};

export default Perfil;
