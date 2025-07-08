import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
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
    API.get('/productos')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      });
  }, []);

  const catNormalized = normalizeCategory(categoria);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      catNormalized === 'todas' ||
      (
        product.categoria &&
        (
          (Array.isArray(product.categoria) &&
            product.categoria.some(cat => normalizeCategory(cat) === catNormalized)) ||
          (typeof product.categoria === 'string' &&
            normalizeCategory(product.categoria) === catNormalized)
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

  if (loading) return <p className="p-8 text-center">Cargando productos...</p>;

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-[#333] text-white p-3 rounded-full shadow-lg z-50 md:hidden"
        onClick={toggleFiltros}
        aria-label="Mostrar filtros"
      >
        <FiFilter size={20} />
      </button>

      <div className="flex flex-col md:flex-row container mx-auto px-4 py-6 gap-6">
        {/* Sidebar filtros */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4
            transform transition-transform duration-300
            z-40
            md:relative md:translate-x-0 md:shadow-none md:w-64 md:block
            ${mostrarFiltros ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Filtros de productos"
        >
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>

          <details ref={colorRef} className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Color</summary>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`w-6 h-6 rounded-full border cursor-pointer transition-all duration-200
                  ${selectedColor === 'Todos' ? 'ring-2 ring-[#333]' : 'border-gray-300'}
                  hover:ring-2 hover:ring-[#333]`}
                style={{ backgroundColor: '#e0e0e0' }}
                title="Todos"
                onClick={() => { setSelectedColor('Todos'); closeDetails(colorRef); setMostrarFiltros(false); }}
              />
              {getAllColors().map((colorHex, idx) => (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200
                    ${selectedColor === colorHex ? 'ring-2 ring-[#333]' : ''}
                    hover:ring-2 hover:ring-[#333]`}
                  style={{ backgroundColor: colorHex }}
                  title={colorHex}
                  onClick={() => { setSelectedColor(colorHex); closeDetails(colorRef); setMostrarFiltros(false); }}
                />
              ))}
            </div>
          </details>

          <details ref={sizeRef} className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Talla</summary>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-3 py-1 rounded-full cursor-pointer border transition-colors duration-200
                  ${selectedSize === 'Todas'
                    ? 'bg-[#333] text-white border-[#333]'
                    : 'border-gray-300 hover:bg-[#333] hover:text-white hover:border-[#333]'}`}
                onClick={() => { setSelectedSize('Todas'); closeDetails(sizeRef); setMostrarFiltros(false); }}
              >
                Todas
              </span>
              {getAllSizes().map((size, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full cursor-pointer border transition-colors duration-200
                    ${selectedSize === size
                      ? 'bg-[#333] text-white border-[#333]'
                      : 'border-gray-300 hover:bg-[#333] hover:text-white hover:border-[#333]'}`}
                  onClick={() => { setSelectedSize(size); closeDetails(sizeRef); setMostrarFiltros(false); }}
                >
                  {size}
                </span>
              ))}
            </div>
          </details>

          <details ref={priceRef} className="mb-4">
            <summary className="cursor-pointer font-medium mb-2">Rango de precio</summary>
            <input
              type="range"
              min={0}
              max={300000}
              step={50000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              onMouseUp={() => { closeDetails(priceRef); setMostrarFiltros(false); }}
              onTouchEnd={() => { closeDetails(priceRef); setMostrarFiltros(false); }}
              className="w-full mt-2"
            />
            <p className="mt-1">Hasta ${maxPrice.toLocaleString()}</p>
          </details>
        </aside>

        {/* Grid productos */}
        <main className="flex-1 grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {productosPagina.length > 0 ? (
            productosPagina.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 p-6">
              No se encontraron productos que coincidan con los filtros seleccionados.
            </div>
          )}
        </main>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 mb-10">
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="p-2 rounded disabled:opacity-50 hover:bg-gray-200"
            aria-label="Página anterior"
          >
            <FiChevronLeft size={20} />
          </button>
          <span>
            Página <strong>{paginaActual}</strong>
          </span>
          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="p-2 rounded disabled:opacity-50 hover:bg-gray-200"
            aria-label="Página siguiente"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
