import React, { useEffect } from 'react';

const ShippingBox = ({ envioActual, onCambioEnvio, total }) => {
  const opciones = {
    bga: {
      label: 'Bucaramanga y alrededores',
      costo: 8000,
      descripcion: '1-2 días hábiles',
    },
    nacional: {
      label: 'Envío Nacional',
      costo: 15000,
      descripcion: '2-5 días hábiles',
    },
  };

  // Detecta si se aplica envío gratis
  const envioGratis = total >= 300000;

  // ⚠️ Se actualiza automáticamente cuando cambia el total o tipo
  useEffect(() => {
    const opcion = opciones[envioActual.tipo];

    const nuevoEnvio = {
      tipo: envioActual.tipo,
      costo: envioGratis ? 0 : opcion.costo,
      descripcion: envioGratis
        ? '¡Envío gratis por superar $300.000!'
        : opcion.descripcion,
    };

    onCambioEnvio(nuevoEnvio);
  }, [total, envioActual.tipo]); // ← dependencias importantes

  // Cuando el usuario selecciona otro tipo de envío
  const handleChange = (e) => {
    const tipoSeleccionado = e.target.value;
    onCambioEnvio(prev => ({ ...prev, tipo: tipoSeleccionado }));
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      background: '#fafafa'
    }}>
      <h4 style={{ marginBottom: '0.8rem' }}>Opciones de Envío</h4>

      <select
        value={envioActual.tipo}
        onChange={handleChange}
        style={{
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          width: '100%',
          marginBottom: '0.8rem'
        }}
      >
        {Object.entries(opciones).map(([key, option]) => (
          <option key={key} value={key}>
            {option.label}
          </option>
        ))}
      </select>

      <p><strong>Costo:</strong> ${envioActual.costo.toLocaleString()}</p>
      <p><strong>Entrega:</strong> {envioActual.descripcion}</p>
    </div>
  );
};

export default ShippingBox;
