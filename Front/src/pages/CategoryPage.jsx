// src/pages/CategoryPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // ✅ Usar instancia axios configurada
import ProductCard from '../components/ProductCard';
import '../components/ProductList.css';

const CategoryPage = () => {
  const { categoria } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(200000);

  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const priceRef = useRef(null);

  // Función para normalizar nombres de categoría (quita espacios y guiones, todo minúscula)
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

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;

  return (
    <div className="category-page" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {/* Sidebar de filtros */}
      <aside className="sidebar" style={{ padding: '2rem', borderRight: '1px solid #ddd', minWidth: '250px' }}>
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
              onClick={() => { setSelectedColor('Todos'); closeDetails(colorRef); }}
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
                onClick={() => { setSelectedColor(colorHex); closeDetails(colorRef); }}
              ></span>
            ))}
          </div>
        </details>

        <details ref={sizeRef}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>Talla</summary>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => { setSelectedSize('Todas'); closeDetails(sizeRef); }}
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
                onClick={() => { setSelectedSize(size); closeDetails(sizeRef); }}
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
            onMouseUp={() => closeDetails(priceRef)}
            onTouchEnd={() => closeDetails(priceRef)}
          />
          <p>Hasta ${maxPrice.toLocaleString()}</p>
        </details>
      </aside>

      {/* Grid de productos */}
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
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
  );
};

export default CategoryPage;
