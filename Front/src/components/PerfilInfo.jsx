// src/components/PerfilInfo.jsx
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'No registrada';
  const fecha = new Date(fechaISO);
  const dia = fecha.getUTCDate().toString().padStart(2, '0');
  const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
};

const PerfilInfo = ({ datosPerfil }) => {
  if (!datosPerfil) return <p>No se encontraron datos.</p>;
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
};

export default PerfilInfo;
