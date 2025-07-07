import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import '../components/ProductList.css';
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

  const closeDetails = (ref) => {
    if (ref.current) ref.current.removeAttribute('open');
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [selectedColor, selectedSize, maxPrice, categoria]);

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPaginas = Math.ceil(filteredProducts.length / productosPorPagina);
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFinal = indexInicio + productosPorPagina;
  const productosPagina = filteredProducts.slice(indexInicio, indexFinal);

  if (loading) return <p className="loading-text">Cargando productos...</p>;

  return (
    <>
      <button className="filtro-flotante" onClick={toggleFiltros}>
        <FiFilter size={18} />
      </button>

      <div className={`product-list-container ${mostrarFiltros ? 'show-mobile' : ''}`}>
        {/* Sidebar filtros */}
        <aside className={`sidebar ${mostrarFiltros ? 'show-mobile' : ''}`}>
          <h4 className="filter-title">Filtros</h4>

          <details ref={colorRef}>
            <summary className="summary-clickable">Color</summary>
            <div className="color-filter-dots">
              <span
                className={`color-dot ${selectedColor === 'Todos' ? 'selected' : ''}`}
                style={{ backgroundColor: '#e0e0e0' }}
                title="Todos"
                onClick={() => { setSelectedColor('Todos'); closeDetails(colorRef); setMostrarFiltros(false); }}
              ></span>
              {getAllColors().map((colorHex, idx) => (
                <span
                  key={idx}
                  className={`color-dot ${selectedColor === colorHex ? 'selected' : ''}`}
                  style={{ backgroundColor: colorHex }}
                  title={colorHex}
                  onClick={() => { setSelectedColor(colorHex); closeDetails(colorRef); setMostrarFiltros(false); }}
                ></span>
              ))}
            </div>
          </details>

          <details ref={sizeRef}>
            <summary className="summary-clickable">Talla</summary>
            <div>
              <span
                className={`selector-tag ${selectedSize === 'Todas' ? 'selected' : ''}`}
                onClick={() => { setSelectedSize('Todas'); closeDetails(sizeRef); setMostrarFiltros(false); }}
              >
                Todas
              </span>
              {getAllSizes().map((size, idx) => (
                <span
                  key={idx}
                  className={`selector-tag ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => { setSelectedSize(size); closeDetails(sizeRef); setMostrarFiltros(false); }}
                >
                  {size}
                </span>
              ))}
            </div>
          </details>

          <details ref={priceRef}>
            <summary className="summary-clickable">Rango de precio</summary>
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
        <main className="products-grid">
          {productosPagina.length > 0 ? (
            productosPagina.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products-message">
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
