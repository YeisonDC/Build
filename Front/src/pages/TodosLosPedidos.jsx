import React, { useEffect, useState } from 'react';
import API from '../api';
import './TodosLosPedidos.css'; // Puedes crear este archivo para estilos opcionales

const TodosLosPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await API.get('/pedido/todos'); // <-- Esta ruta ya la creamos
        setPedidos(res.data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter(p =>
    p.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.correo_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.celular_cliente.includes(busqueda)
  );

  return (
    <div className="admin-pedidos">
      <h2>Todos los Pedidos</h2>

      <input
        type="text"
        placeholder="Buscar por nombre, correo o celular..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p>No se encontraron pedidos.</p>
      ) : (
        pedidosFiltrados.map((pedido) => (
          <div key={pedido._id} className="pedido-card">
            <p><strong>Cliente:</strong> {pedido.nombre_cliente}</p>
            <p><strong>Correo:</strong> {pedido.correo_cliente}</p>
            <p><strong>Celular:</strong> {pedido.celular_cliente}</p>
            <p><strong>Dirección:</strong> {pedido.direccion_envio}</p>
            <p><strong>Fecha:</strong> {pedido.fecha_pedido}</p>
            <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>

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
        ))
      )}
    </div>
  );
};

export default TodosLosPedidos;
