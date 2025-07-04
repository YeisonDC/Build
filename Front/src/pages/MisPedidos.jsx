import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const res = await API.get('/pedido/mis-pedidos');
        setPedidos(res.data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
      } finally {
        setCargando(false);
      }
    };

    if (user) {
      obtenerPedidos();
    }
  }, [user]);

  if (cargando) return <p>Cargando pedidos...</p>;
  if (pedidos.length === 0) return <p>No tienes pedidos aún.</p>;

  return (
    <div className="perfil-pedidos">
      <h2>Mis Pedidos</h2>
      {pedidos.map((pedido) => (
        <div key={pedido._id} className="pedido-card">
          <p><strong>Fecha:</strong> {pedido.fecha_pedido}</p>
          <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>
          <p><strong>Estado:</strong> {pedido.estado || 'Procesando'}</p>

          <div className="productos-lista">
            {pedido.productos.map((prod, i) => (
              <div key={i} className="producto-item">
                <img src={prod.imagen} alt={prod.nombre} width="60" />
                <div>
                  <p>{prod.nombre}</p>
                  <p>Talla: {prod.talla} – Cantidad: {prod.cantidad}</p>
                  <p>Precio total: ${prod.precio_total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MisPedidos;
