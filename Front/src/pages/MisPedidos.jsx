import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import './MisPedidos.css';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaFecha, setBusquedaFecha] = useState('');
  const [busquedaId, setBusquedaId] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5;

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

  // Filtrado
  const pedidosFiltrados = pedidos.filter(p =>
    (p.fecha_pedido || '').toLowerCase().includes(busquedaFecha.toLowerCase()) &&
    (p._id || '').toLowerCase().includes(busquedaId.toLowerCase())
  );

  // Paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const indiceInicio = (paginaActual - 1) * pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceInicio + pedidosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  if (cargando) return <p className="perfil-pedidos__cargando">Cargando pedidos...</p>;
  if (pedidos.length === 0) return <p className="perfil-pedidos__vacio">No tienes pedidos aún.</p>;

  return (
    <div className="perfil-pedidos">
      <h2 className="perfil-pedidos__titulo">Mis Pedidos</h2>

      <div className="perfil-pedidos__filtros">
        <input
          type="text"
          placeholder="Filtrar por fecha (dd/mm/aaaa)"
          value={busquedaFecha}
          onChange={(e) => setBusquedaFecha(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por ID de pedido"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
        />
      </div>

      <p className="perfil-pedidos__contador">Total de pedidos: {pedidosFiltrados.length}</p>

      {pedidosPaginados.map((pedido) => (
        <div key={pedido._id} className="perfil-pedidos__card">
          <div className="perfil-pedidos__info">
            <p><strong>Fecha:</strong> {pedido.fecha_pedido}</p>
            <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>
            <p><strong>Envío:</strong> ${pedido.valor_envio?.toLocaleString() || 0}</p>
            <p><strong>ID:</strong> {pedido._id}</p>
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

      {totalPaginas > 1 && (
        <div className="perfil-pedidos__paginacion">
          <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1}>
            &laquo; Anterior
          </button>
          <span>Página {paginaActual} de {totalPaginas}</span>
          <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
            Siguiente &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
