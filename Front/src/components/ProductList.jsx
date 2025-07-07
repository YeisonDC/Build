import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import API from '../api';
import './ProductList.css';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductList = ({ initialCategory = null }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Todas');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  useEffect(() => {
    setSelectedCategory(initialCategory || 'Todas');
  }, [initialCategory]);

  useEffect(() => {
    API.get('/productos')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesColor =
        selectedColor === 'Todos' ||
        product.colores.some(c => Array.isArray(c.color) ? c.color[1] === selectedColor : c.color === selectedColor);

      const matchesSize =
        selectedSize === 'Todas' ||
        product.colores.some(c =>
          c.tallas.some(t => t.talla === selectedSize)
        );

      const matchesCategory =
        selectedCategory === 'Todas' ||
        (
          Array.isArray(product.categoria) &&
          product.categoria.some(cat =>
            cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
          )
        );

      const matchesPrice = product.precio <= maxPrice;

      return matchesColor && matchesSize && matchesCategory && matchesPrice;
    });

    setFilteredProducts(filtered);
    setPaginaActual(1);
  }, [selectedColor, selectedSize, selectedCategory, maxPrice, products]);

  const getAllColors = () => {
    const colors = products.flatMap(p =>
      p.colores.map(c => Array.isArray(c.color) ? c.color[1] : c.color)
    );
    return Array.from(new Set(colors));
  };

  const getAllSizes = () => {
    const sizes = products.flatMap(p =>
      p.colores.flatMap(c => c.tallas.map(t => t.talla))
    );
    return Array.from(new Set(sizes));
  };

  const getAllCategories = () => {
    const categories = products.flatMap(p => p.categoria || []);
    return Array.from(new Set(categories));
  };

  const closeDetails = (ref) => {
    if (ref.current) ref.current.removeAttribute('open');
  };

  const handleMostrarFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFinal = indexInicio + productosPorPagina;
  const productosPagina = filteredProducts.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(filteredProducts.length / productosPorPagina);

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;

  return (
    <>
      {/* Botón flotante para filtros */}
      <button className="filtro-flotante" onClick={handleMostrarFiltros}>
        <FiFilter size={18} />
      </button>

      <div className="product-list-container">
        <aside className={`sidebar ${mostrarFiltros ? 'show-mobile' : ''}`}>
          <h2 className="filter-title">Filtros</h2>

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

          {!initialCategory && (
            <details ref={categoryRef}>
              <summary className="summary-clickable">Categoría</summary>
              <div className="category-list">
                <span
                  className={`selector-tag ${selectedCategory === 'Todas' ? 'selected' : ''}`}
                  onClick={() => { setSelectedCategory('Todas'); closeDetails(categoryRef); setMostrarFiltros(false); }}
                >
                  Todas
                </span>
                {getAllCategories().map((cat, idx) => (
                  <span
                    key={idx}
                    className={`selector-tag ${selectedCategory === cat ? 'selected' : ''}`}
                    onClick={() => { setSelectedCategory(cat); closeDetails(categoryRef); setMostrarFiltros(false); }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </details>
          )}

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

        <main className="products-grid">
          {productosPagina.length > 0 ? (
            productosPagina.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products-message">
              No se encontraron productos que coincidan con los filtros seleccionados.
            </div>
          )}
        </main>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="product-list__paginacion">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
            <FiChevronLeft />
          </button>
          <span>Página {paginaActual}</span>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default ProductList;
