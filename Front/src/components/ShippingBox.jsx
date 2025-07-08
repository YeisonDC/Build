import React, { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const ShippingBox = ({ envioActual, onCambioEnvio, total, onCuponAplicado }) => {
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

  const envioGratis = total >= 300000;

  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuento, setDescuento] = useState(0);

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
  }, [total, envioActual.tipo]);

  const handleChange = (e) => {
    const tipoSeleccionado = e.target.value;
    onCambioEnvio(prev => ({ ...prev, tipo: tipoSeleccionado }));
  };

  const aplicarCupon = async () => {
    try {
      const res = await API.post('/cupones/validar', { codigo: codigoCupon });
      const porcentaje = res.data.descuento;

      setDescuento(porcentaje);
      toast.success(`¡Cupón aplicado! ${porcentaje}% de descuento`);
      onCuponAplicado(porcentaje, codigoCupon);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cupón inválido');
      setDescuento(0);
      onCuponAplicado(0, '');
    }
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

      <hr style={{ margin: '1rem 0' }} />

      <h4 style={{ marginBottom: '0.8rem' }}>Cupón de Descuento</h4>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
        <input
          type="text"
          value={codigoCupon}
          onChange={(e) => setCodigoCupon(e.target.value)}
          placeholder="Ingresa tu cupón"
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={aplicarCupon}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Aplicar
        </button>
      </div>

      {descuento > 0 && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          Cupón aplicado: -{descuento}%
        </p>
      )}
    </div>
  );
};

export default ShippingBox;
