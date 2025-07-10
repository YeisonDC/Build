import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './Perfil.css';
import { FiUser, FiShoppingBag, FiSettings, FiPlusSquare, FiList, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { obtenerRol } from '../services/token';
import MisPedidos from './MisPedidos';
import CrearCupon from '../components/CrearCupones';
import AdministrarCupon from '../components/AdministrarCupon';
import PerfilInfo from '../components/PerfilInfo';
import EditarPerfil from '../components/EditarPerfil';
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
      return <PerfilInfo datosPerfil={datosPerfil} />;
    }

    if (seccionActiva === 'pedidos') return <MisPedidos />;

    if (seccionActiva === 'configuracion') {
      return (
        <EditarPerfil
          formulario={formulario}
          formCorreo={formCorreo}
          formContrasena={formContrasena}
          formDireccion={formDireccion}
          handleChange={handleChange}
          handleChangeCorreo={handleChangeCorreo}
          handleChangeContrasena={handleChangeContrasena}
          handleChangeDireccion={handleChangeDireccion}
          handleGuardarCambios={handleGuardarCambios}
          handleGuardarCorreo={handleGuardarCorreo}
          handleGuardarContrasena={handleGuardarContrasena}
          handleGuardarDireccion={handleGuardarDireccion}
          subSeccionConfig={subSeccionConfig}
          setSubSeccionConfig={setSubSeccionConfig}
        />
      );
    }

    if (seccionActiva === 'cupones' && rol === 'ADMIN') {
      return <CrearCupon />;
    }

    if (seccionActiva === 'admin-cupones' && rol === 'ADMIN') {
      return <AdministrarCupon />;
    }

    return null;
  };

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <p className="sidebar-title">Mi cuenta</p>
        <button onClick={() => setSeccionActiva('perfil')} className={seccionActiva === 'perfil' ? 'active' : ''}>
          <FiUser className="icon-left" />
          Perfil
        </button>
        <button onClick={() => setSeccionActiva('pedidos')} className={seccionActiva === 'pedidos' ? 'active' : ''}>
          <FiShoppingBag className="icon-left" />
          Pedidos
        </button>
        <button onClick={() => setSeccionActiva('configuracion')} className={seccionActiva === 'configuracion' ? 'active' : ''}>
          <FiSettings className="icon-left" />
          Configuración
        </button>

        {rol === 'ADMIN' && (
          <>
            <hr className="divider" />
            <p className="sidebar-title">Administración</p>
            <button className="btn-admin btn-esconder-mobile" onClick={() => navigate('/crear-producto')}>
              <FiPlusSquare className="icon-left" />
              Crear artículo
            </button>
            <button className="btn-admin btn-esconder-mobile" onClick={() => navigate('/admin/productos')}>
              <FiList className="icon-left" />
              Todos los artículos
            </button>
            <button className="btn-admin" onClick={() => navigate('/admin/pedidos')}>
              <FiShoppingBag className="icon-left" />
              Todos los pedidos
            </button>
            <button className="btn-admin" onClick={() => setSeccionActiva('cupones')}>
              <FiTag className="icon-left" />
              Crear Cupones
            </button>
            <button className="btn-admin" onClick={() => setSeccionActiva('admin-cupones')}>
              <FiTag className="icon-left" />
              Administrar Cupones
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
