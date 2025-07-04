import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './MisPedidos.css';

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

  if (cargando) return <p className="perfil-pedidos__cargando">Cargando pedidos...</p>;
  if (pedidos.length === 0) return <p className="perfil-pedidos__vacio">No tienes pedidos aún.</p>;

  return (
    <div className="perfil-pedidos">
      <h2 className="perfil-pedidos__titulo">Mis Pedidos</h2>

      {pedidos.map((pedido) => (
        <div key={pedido._id} className="perfil-pedidos__card">
          <div className="perfil-pedidos__info">
            <p><strong>Fecha:</strong> {pedido.fecha_pedido}</p>
            <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>
            <p><strong>Estado:</strong> {pedido.estado || 'Procesando'}</p>
          </div>

          <div className="perfil-pedidos__productos">
            {pedido.productos.map((prod, i) => (
              <div key={i} className="perfil-pedidos__producto">
                <img src={prod.imagen} alt={prod.nombre} />
                <div className="perfil-pedidos__producto-info">
                  <p className="nombre">{prod.nombre}</p>
                  <p className="detalle">Talla: {prod.talla} – Cantidad: {prod.cantidad}</p>
                  <p className="precio">Precio total: ${prod.precio_total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MisPedidos;
