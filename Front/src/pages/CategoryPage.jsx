// src/pages/CategoryPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // instancia axios configurada
import ProductCard from '../components/ProductCard';
import '../components/ProductList.css'; // reutilizamos estilos, con clases específicas en JSX para evitar conflictos
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CategoryPage = () => {
  const { categoria } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(300000);

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const priceRef = useRef(null);

  // Normaliza string para comparar categorías
  const normalizeCategory = (str) =>
    str.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await API.get('/productos');
        setProducts(res.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const catNormalized = normalizeCategory(categoria);

  // Filtrado con categorías, colores, tallas y precio
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      catNormalized === 'todas' ||
      (
        product.categoria &&
        (
          (Array.isArray(product.categoria) && product.categoria.some(cat => normalizeCategory(cat) === catNormalized)) ||
          (typeof product.categoria === 'string' && normalizeCategory(product.categoria) === catNormalized)
        )
      );

    const matchesColor =
      selectedColor === 'Todos' ||
      product.colores.some(c =>
        Array.isArray(c.color) ? c.color[1] === selectedColor : c.color === selectedColor
      );

    const matchesSize =
      selectedSize === 'Todas' ||
      product.colores.some(c =>
        c.tallas.some(t => t.talla === selectedSize)
      );

    const matchesPrice = product.precio <= maxPrice;

    return matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  // Opciones dinámicas para filtros desde los productos filtrados
  const getAllColors = () => {
    const colors = filteredProducts.flatMap(p =>
      p.colores.map(c => Array.isArray(c.color) ? c.color[1] : c.color)
    );
    return Array.from(new Set(colors));
  };

  const getAllSizes = () => {
    const sizes = filteredProducts.flatMap(p =>
      p.colores.flatMap(c => c.tallas.map(t => t.talla))
    );
    return Array.from(new Set(sizes));
  };

  // Para cerrar detalles en móvil
  const closeDetails = (ref) => {
    if (ref.current) ref.current.removeAttribute('open');
  };

  // Estilos inline para botones de talla/color
  const buttonStyle = {
    fontSize: '0.72rem',
    backgroundColor: '#f8f8f8',
    padding: '3px 7px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };

  const selectedButtonStyle = {
    backgroundColor: '#111',
    color: '#fff',
    borderColor: '#111',
  };

  // Manejo paginación
  const totalPaginas = Math.ceil(filteredProducts.length / productosPorPagina);
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFinal = indexInicio + productosPorPagina;
  const productosPagina = filteredProducts.slice(indexInicio, indexFinal);

  // Resetea página actual si cambia el filtro
  useEffect(() => {
    setPaginaActual(1);
  }, [selectedColor, selectedSize, maxPrice, categoria]);

  // Alterna mostrar filtros en móvil
  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;

  return (
    <>
      {/* Botón flotante para filtros en móvil */}
      <button className="filtro-flotante" onClick={toggleFiltros}>
        <FiFilter size={18} />
      </button>

      <div className={`category-page ${mostrarFiltros ? 'show-mobile' : ''}`} style={{ display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
        {/* Sidebar filtros */}
        <aside className={`sidebar ${mostrarFiltros ? 'show-mobile' : ''}`} style={{ padding: '2rem', borderRight: '1px solid #ddd', minWidth: '250px' }}>
          <h4 className="filter-title">Filtros</h4>

          <details ref={colorRef}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>Color</summary>
            <div className="color-filter-dots">
              <span
                className={`color-dot ${selectedColor === 'Todos' ? 'selected' : ''}`}
                style={{
                  backgroundColor: '#e0e0e0',
                  border: '1px solid #aaa',
                  width: '22px',
                  height: '22px',
                  cursor: 'pointer'
                }}
                title="Todos"
                onClick={() => { setSelectedColor('Todos'); closeDetails(colorRef); setMostrarFiltros(false); }}
              ></span>
              {getAllColors().map((colorHex, idx) => (
                <span
                  key={idx}
                  className={`color-dot ${selectedColor === colorHex ? 'selected' : ''}`}
                  style={{
                    backgroundColor: colorHex,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: '1px solid #aaa',
                    cursor: 'pointer',
                    marginRight: '4px'
                  }}
                  title={colorHex}
                  onClick={() => { setSelectedColor(colorHex); closeDetails(colorRef); setMostrarFiltros(false); }}
                ></span>
              ))}
            </div>
          </details>

          <details ref={sizeRef}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>Talla</summary>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { setSelectedSize('Todas'); closeDetails(sizeRef); setMostrarFiltros(false); }}
                style={{
                  ...buttonStyle,
                  ...(selectedSize === 'Todas' ? selectedButtonStyle : {})
                }}
              >
                Todas
              </button>
              {getAllSizes().map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedSize(size); closeDetails(sizeRef); setMostrarFiltros(false); }}
                  style={{
                    ...buttonStyle,
                    ...(selectedSize === size ? selectedButtonStyle : {})
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </details>

          <details ref={priceRef}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>Rango de precio</summary>
            <input
              type="range"
              min={0}
              max={300000}
              step={50000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              onMouseUp={() => { closeDetails(priceRef); setMostrarFiltros(false); }}
              onTouchEnd={() => { closeDetails(priceRef); setMostrarFiltros(false); }}
            />
            <p>Hasta ${maxPrice.toLocaleString()}</p>
          </details>
        </aside>

        {/* Grid productos */}
        <main
          className="product-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2rem',
            padding: '2rem',
            flex: 1
          }}
        >
          {productosPagina.length > 0 ? (
            productosPagina.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              color: '#555',
              fontSize: '1.1rem'
            }}>
              No se encontraron productos que coincidan con los filtros seleccionados en esta categoría.
            </div>
          )}
        </main>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="product-list__paginacion">
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
            aria-label="Página anterior"
          >
            <FiChevronLeft />
          </button>
          <span>Página {paginaActual}</span>
          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            aria-label="Página siguiente"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
