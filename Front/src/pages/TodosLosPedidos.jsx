import React, { useEffect, useState } from 'react';
import API from '../api';
import './TodosLosPedidos.css';

const TodosLosPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaFecha, setBusquedaFecha] = useState('');
  const [busquedaId, setBusquedaId] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5;
  const [detallesAbiertos, setDetallesAbiertos] = useState({});

  // 🔁 Obtener todos los pedidos
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/pedido/todos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPedidos(res.data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, []);

  // 🔁 Reiniciar a la primera página cuando se filtra
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaFecha, busquedaId]);

  // ✅ Filtrado corregido por fecha y ID
  const pedidosFiltrados = pedidos.filter(p => {
    let coincideFecha = true;
    if (busquedaFecha) {
      const partes = busquedaFecha.split('-'); // yyyy-mm-dd
      const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`; // dd/mm/yyyy
      coincideFecha = (p.fecha_pedido || '').includes(fechaFormateada);
    }

    const coincideId = (p._id || '').toLowerCase().includes(busquedaId.toLowerCase());
    return coincideFecha && coincideId;
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const indiceInicio = (paginaActual - 1) * pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceInicio + pedidosPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const toggleDetalles = (id) => {
    setDetallesAbiertos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (cargando) return <p className="admin-pedidos__cargando">Cargando pedidos...</p>;
  if (pedidos.length === 0) return <p className="admin-pedidos__vacio">No hay pedidos registrados.</p>;

  return (
    <div className="admin-pedidos">
      <h2 className="admin-pedidos__titulo">Todos los Pedidos</h2>

      <div className="admin-pedidos__filtros">
        <input
          type="date"
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

      <p className="admin-pedidos__contador">Total de pedidos: {pedidosFiltrados.length}</p>

      {pedidosPaginados.map((pedido) => (
        <div key={pedido._id} className="admin-pedidos__card">
          <div className="admin-pedidos__info">
            <p><strong>Fecha:</strong> {pedido.fecha_pedido}</p>
            <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>
            <p><strong>Envío:</strong> ${pedido.valor_envio?.toLocaleString() || 0}</p>
            <p><strong>ID:</strong> {pedido._id}</p>
            <button
              className="admin-pedidos__detalles-btn"
              onClick={() => toggleDetalles(pedido._id)}
            >
              {detallesAbiertos[pedido._id] ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
          </div>

          {detallesAbiertos[pedido._id] && (
            <div className="admin-pedidos__detalles">
              <p><strong>Cliente:</strong> {pedido.nombre_cliente}</p>
              <p><strong>Correo:</strong> {pedido.correo_cliente}</p>
              <p><strong>Celular:</strong> {pedido.celular_cliente}</p>
              <p><strong>Dirección:</strong> {pedido.direccion_envio}</p>
            </div>
          )}

          <div className="admin-pedidos__productos">
            {pedido.productos.map((prod, i) => (
              <div key={i} className="admin-pedidos__producto">
                <img src={prod.imagen} alt={prod.nombre} />
                <div className="admin-pedidos__producto-info">
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
        <div className="admin-pedidos__paginacion">
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

export default TodosLosPedidos;
