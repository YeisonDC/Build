import React, { useEffect, useState } from 'react';
import API from '../api'; // Cambiado axios por instancia API
import AdminProductList from '../components/AdminProductList';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ProductEdit.css';

const ProductEdit = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [categorias, setCategorias] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [animarSalida, setAnimarSalida] = useState(false);

  useEffect(() => {
    API.get('/productos')
      .then(res => {
        setProductos(res.data);
        setCategorias(extractCategorias(res.data));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setLoading(false);
      });
  }, []);

  const extractCategorias = (productos) => {
    const catSet = new Set();
    productos.forEach(p => {
      if (Array.isArray(p.categoria)) {
        p.categoria.forEach(c => catSet.add(c));
      }
    });
    return ['Todas', ...Array.from(catSet)];
  };

  const handleUpdateProducto = async (productoActualizado) => {
    try {
      const res = await API.put(`/productos/${productoActualizado._id}`, productoActualizado);
      setProductos(prev =>
        prev.map(p => (p._id === productoActualizado._id ? res.data : p))
      );
    } catch (err) {
      console.error('Error al actualizar producto:', err);
    }
  };

  const pedirConfirmacionEliminar = (productoId) => {
    setProductoAEliminar(productoId);
    setModalVisible(true);
    setAnimarSalida(false);
  };

  const confirmarEliminar = async () => {
    try {
      await API.delete(`/productos/eliminar/${productoAEliminar}`);
      setProductos(prev => prev.filter(p => p._id !== productoAEliminar));
      toast.success('Producto eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar el producto:', err);
    } finally {
      setModalVisible(false);
      setProductoAEliminar(null);
      setAnimarSalida(false);
    }
  };

  const cancelarEliminar = () => {
    setAnimarSalida(true);
    setTimeout(() => {
      setModalVisible(false);
      setProductoAEliminar(null);
      setAnimarSalida(false);
    }, 400);
  };

  const productosFiltrados = productos.filter(producto => {
    const nombreLower = producto.nombre?.toLowerCase() || '';
    const busquedaCoincide = nombreLower.includes(searchTerm.toLowerCase());
    const categoriaCoincide = categoriaFiltro === 'Todas' || (producto.categoria && producto.categoria.includes(categoriaFiltro));
    return busquedaCoincide && categoriaCoincide;
  });

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;

  return (
    <div className="product-edit-page">

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Link
          to="/perfil"
          title="Volver a Perfil"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#333',
            textDecoration: 'none',
            padding: '0.2rem 0.4rem',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            lineHeight: 1,
            userSelect: 'none',
            width: '36px',
            height: '36px',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eee'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FaArrowLeft />
        </Link>

        <h1 style={{ margin: 0, fontWeight: '600' }}>Administrar Productos</h1>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
        >
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <AdminProductList
        products={productosFiltrados}
        onProductUpdate={handleUpdateProducto}
        onProductDelete={pedirConfirmacionEliminar}
      />

      {modalVisible && (
        <>
          <div
            className={`modal-backdrop ${animarSalida ? 'fadeOut' : 'fadeIn'}`}
            onClick={cancelarEliminar}
          />
          <div className="modal-wrapper">
            <div
              className={`modal-container ${animarSalida ? 'bounceOut' : 'bounceIn'}`}
              role="dialog"
              aria-modal="true"
            >
              <p>¿Estás seguro que quieres eliminar este producto?</p>
              <div className="modal-buttons">
                <button className="btn-confirm" onClick={confirmarEliminar}>Eliminar</button>
                <button className="btn-cancel" onClick={cancelarEliminar}>Cancelar</button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-200px);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) translateY(30px);
          }
          80% {
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounceOut {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          20% {
            transform: scale(1.1) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateY(200px);
          }
        }

        .fadeIn {
          animation: fadeIn 0.3s forwards;
        }
        .fadeOut {
          animation: fadeOut 0.3s forwards;
        }
        .bounceIn {
          animation: bounceIn 0.5s forwards cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }
        .bounceOut {
          animation: bounceOut 0.4s forwards cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(5px);
          z-index: 999;
        }

        .modal-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
          max-width: 400px;
          width: 90%;
          text-align: center;
          font-family: sans-serif;
        }

        .modal-container p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .btn-confirm {
          background-color: #e74c3c;
          border: none;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-confirm:hover {
          background-color: #c0392b;
        }
        .btn-cancel {
          background-color: #aaa;
          border: none;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-cancel:hover {
          background-color: #888;
        }
      `}</style>
    </div>
  );
};

export default ProductEdit;
