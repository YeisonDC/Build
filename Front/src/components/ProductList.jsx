import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import API from '../api'; // ✅ Importar API con baseURL dinámica
import './ProductList.css';

const ProductList = ({ initialCategory = null }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState('Todos');
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Todas');
  const [maxPrice, setMaxPrice] = useState(300000);

  const colorRef = useRef(null);
  const sizeRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  const sizeButtonStyle = {
    fontSize: '0.72rem',
    backgroundColor: '#f8f8f8',
    padding: '3px 7px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  };

  const selectedSizeButtonStyle = {
    backgroundColor: '#111',
    color: '#fff',
    borderColor: '#111',
  };

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

  if (loading) return <p style={{ padding: '2rem' }}>Cargando productos...</p>;

  return (
    <div className="product-list-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {/* Sidebar de filtros */}
      <aside className="sidebar" style={{ padding: '2rem', borderRight: '1px solid #ddd', minWidth: '250px' }}>
        <h2 className="filter-title">Filtros</h2>

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
                ...sizeButtonStyle,
                ...(selectedSize === 'Todas' ? selectedSizeButtonStyle : {})
              }}
            >
              Todas
            </button>
            {getAllSizes().map((size, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedSize(size); closeDetails(sizeRef); }}
                style={{
                  ...sizeButtonStyle,
                  ...(selectedSize === size ? selectedSizeButtonStyle : {})
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </details>

        {!initialCategory && (
          <details ref={categoryRef}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', margin: '1rem 0 0.5rem' }}>Categoría</summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { setSelectedCategory('Todas'); closeDetails(categoryRef); }}
                style={{
                  ...sizeButtonStyle,
                  ...(selectedCategory === 'Todas' ? selectedSizeButtonStyle : {})
                }}
              >
                Todas
              </button>
              {getAllCategories().map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedCategory(cat); closeDetails(categoryRef); }}
                  style={{
                    ...sizeButtonStyle,
                    ...(selectedCategory === cat ? selectedSizeButtonStyle : {})
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </details>
        )}

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

      {/* Grid de productos (alineado como CategoryPage) */}
      <main
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
            No se encontraron productos que coincidan con los filtros seleccionados.
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
