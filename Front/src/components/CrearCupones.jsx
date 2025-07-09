import React, { useState } from 'react';
import API from '../api';

const AdministrarCupon = () => {
  const [formulario, setFormulario] = useState({
    codigo: '',
    descuento: '',
    tipo: 'una_vez_total',
    fecha_expiracion: '',
    usos_disponibles: ''
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const tiposCupon = [
    'una_vez_total',
    'una_vez_por_usuario',
    'cantidad_limitada',
    'permanente'
  ];

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      const body = { ...formulario };
      if (body.tipo !== 'cantidad_limitada') delete body.usos_disponibles;

      const res = await API.post('/cupones/crear', body);
      setMensaje('✅ Cupón creado exitosamente');
      setFormulario({
        codigo: '',
        descuento: '',
        tipo: 'una_vez_total',
        fecha_expiracion: '',
        usos_disponibles: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el cupón');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Crear Cupones</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow">
        <div>
          <label className="block mb-1 font-medium">Código</label>
          <input
            type="text"
            name="codigo"
            value={formulario.codigo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            value={formulario.descuento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tipo</label>
          <select
            name="tipo"
            value={formulario.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            {tiposCupon.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {formulario.tipo === 'cantidad_limitada' && (
          <div>
            <label className="block mb-1 font-medium">Usos disponibles</label>
            <input
              type="number"
              name="usos_disponibles"
              value={formulario.usos_disponibles}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Fecha de expiración (opcional)</label>
          <input
            type="date"
            name="fecha_expiracion"
            value={formulario.fecha_expiracion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Crear Cupón
        </button>
      </form>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AdministrarCupon;
