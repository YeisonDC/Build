import React from 'react';

const EditarPerfil = ({
  formulario,
  formCorreo,
  formContrasena,
  formDireccion,
  handleChange,
  handleChangeCorreo,
  handleChangeContrasena,
  handleChangeDireccion,
  handleGuardarCambios,
  handleGuardarCorreo,
  handleGuardarContrasena,
  handleGuardarDireccion,
  subSeccionConfig,
  setSubSeccionConfig
}) => {
  return (
    <div>
      <h2>Configuración de la cuenta</h2>

      <div className="sub-menu">
        <button
          onClick={() => setSubSeccionConfig('perfil')}
          className={subSeccionConfig === 'perfil' ? 'active' : ''}
        >
          Perfil
        </button>
        <button
          onClick={() => setSubSeccionConfig('contraseña')}
          className={subSeccionConfig === 'contraseña' ? 'active' : ''}
        >
          Contraseña
        </button>
        <button
          onClick={() => setSubSeccionConfig('correo')}
          className={subSeccionConfig === 'correo' ? 'active' : ''}
        >
          Correo
        </button>
        <button
          onClick={() => setSubSeccionConfig('envios')}
          className={subSeccionConfig === 'envios' ? 'active' : ''}
        >
          Envíos
        </button>
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
            Calle:
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
};

export default EditarPerfil;
