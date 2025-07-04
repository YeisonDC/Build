import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // ✅ Importar instancia axios con baseURL dinámica
import './ProductDetail.css';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

// ✅ Mejorar calidad para imagen principal
const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    '/upload/w_800,h_960,c_fill,dpr_auto,f_auto,q_auto/'
  );
};

// ✅ Mejorar calidad para miniaturas
const mejorarMiniatura = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    '/upload/w_200,h_240,c_fill,dpr_auto,f_auto,q_auto/'
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDescripcion, setShowDescripcion] = useState(false);
  const [showCuidados, setShowCuidados] = useState(false);
  const [showPagos, setShowPagos] = useState(false);
  const [showEnvios, setShowEnvios] = useState(false);

  // Eliminado estado addedMessage porque usaremos toast para la notificación

  useEffect(() => {
    setLoading(true);
    API.get(`/productos/${id}`) // ✅ Usando instancia API con baseURL dinámica
      .then((res) => {
        const prod = res.data;
        setProduct(prod);

        if (prod.colores && prod.colores.length > 0) {
          setSelectedColor(prod.colores[0].color); // color: [nombre, hex]
          if (prod.colores[0].imagenes?.length > 0) {
            setMainImage(prod.colores[0].imagenes[0]);
          }
          if (prod.colores[0].tallas?.length > 0) {
            setSelectedSize(prod.colores[0].tallas[0].talla);
          }
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const colorObj = product.colores.find(
      (c) => JSON.stringify(c.color) === JSON.stringify(selectedColor)
    );
    const tallaObj = colorObj?.tallas?.find((t) => t.talla === selectedSize);

    if (tallaObj?.imagen) {
      setMainImage(tallaObj.imagen);
    } else if (colorObj?.imagenes?.length > 0) {
      setMainImage(colorObj.imagenes[0]);
    } else {
      setMainImage(null);
    }
  }, [selectedColor, selectedSize, product]);

  if (loading) return <p className="loading-text">Cargando producto...</p>;
  if (!product) return <p className="error-text">Producto no encontrado</p>;

  const colorObj = product.colores.find(
    (c) => JSON.stringify(c.color) === JSON.stringify(selectedColor)
  );
  const tallaObj = colorObj?.tallas?.find((t) => t.talla === selectedSize);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Selecciona color y talla antes de añadir al carrito.');
      return;
    }

    const selectedProduct = {
      id: product._id,
      name: product.nombre,
      price: product.precio,
      color: selectedColor, // ✅ Se guarda como [nombre, hex]
      size: selectedSize,
      image: mejorarCalidadCloudinary(tallaObj?.imagen || colorObj?.imagenes?.[0] || null),
    };

    addToCart(selectedProduct);
    toast.success('Producto añadido a la cesta', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  return (
    <>
      <main className="product-detail">
        <section className="product-gallery">
          <div className="main-image-container">
            {mainImage ? (
              <img
                src={mejorarCalidadCloudinary(mainImage)}
                alt={product.nombre}
                className="main-image"
                draggable={false}
              />
            ) : (
              <div className="image-placeholder">Sin imagen</div>
            )}
          </div>
          <div className="thumbnails">
            {colorObj?.imagenes?.map((img, i) => (
              <img
                key={i}
                src={mejorarMiniatura(img)}
                alt={`${product.nombre} miniatura ${i + 1}`}
                onClick={() => setMainImage(img)}
                className={`thumbnail ${mainImage === img ? 'selected' : ''}`}
                draggable={false}
              />
            ))}
          </div>
        </section>

        <section className="product-info">
          <h1 className="product-title">{product.nombre.toUpperCase()}</h1>

          <p className="product-price">${product.precio.toLocaleString('es-CO')}</p>
          <p className="product-stock">
            Stock disponible: <strong>{tallaObj?.stock || 0}</strong>
          </p>

          <div className="color-selector">
            <p className="selector-label">Colores:</p>
            <div className="color-options">
              {product.colores.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedColor(c.color); // ✅ c.color: [nombre, hex]
                    setSelectedSize(c.tallas?.[0]?.talla || null);
                  }}
                  className={`color-circle${
                    JSON.stringify(selectedColor) === JSON.stringify(c.color)
                      ? ' selected'
                      : ''
                  }`}
                  style={{ backgroundColor: c.color[1] }}
                  title={c.color[0]} // ✅ Mostrar nombre del color como tooltip
                  type="button"
                  aria-label={`Seleccionar color ${c.color[0]}`}
                />
              ))}
            </div>
          </div>

          <div className="size-selector">
            <p className="selector-label">Selecciona tu talla:</p>
            <div className="size-options">
              {colorObj?.tallas?.length > 0 ? (
                colorObj.tallas.map((t, i) => (
                  <button
                    key={i}
                    className={`size-button${selectedSize === t.talla ? ' selected' : ''}`}
                    onClick={() => setSelectedSize(t.talla)}
                    disabled={t.stock === 0}
                    type="button"
                    aria-label={`Seleccionar talla ${t.talla}`}
                  >
                    {t.talla}
                  </button>
                ))
              ) : (
                <p className="no-sizes">No hay tallas disponibles para este color.</p>
              )}
            </div>
          </div>

          <button
            className="add-to-cart"
            disabled={!selectedSize || (tallaObj?.stock || 0) === 0}
            onClick={handleAddToCart}
            type="button"
          >
            Añadir a la cesta
          </button>

          <button
            className="add-to-cart"
            type="button"
            onClick={() => {
              const msg = `Hola, quiero preguntar sobre el producto: ${product.nombre}`;
              const url = `https://api.whatsapp.com/send?phone=573169056704&text=${encodeURIComponent(msg)}`;
              window.open(url, '_blank');
            }}
          >
            Asistencia por WhatsApp
          </button>

          <details open={showDescripcion} onToggle={() => setShowDescripcion(!showDescripcion)}>
            <summary>Descripción</summary>
            <div className="dropdown-content">
              <p style={{ whiteSpace: 'pre-line' }}>{product.descripcion}</p>
            </div>
          </details>

          <details open={showCuidados} onToggle={() => setShowCuidados(!showCuidados)}>
            <summary>Cuidados de la prenda</summary>
            <div className="dropdown-content">
              <p style={{ whiteSpace: 'pre-line' }}>
                {product.cuidados?.trim()
                  ? product.cuidados
                  : 'No se especifican cuidados especiales para esta prenda.'}
              </p>
            </div>
          </details>

          <details open={showPagos} onToggle={() => setShowPagos(!showPagos)}>
            <summary>Métodos de pago</summary>
            <div className="dropdown-content">
              <p>
                Aceptamos tarjetas de crédito, débito y pagos por PSE a través de Wompi.
                Todas las transacciones son seguras.
              </p>
            </div>
          </details>

          <details open={showEnvios} onToggle={() => setShowEnvios(!showEnvios)}>
            <summary>Envíos y devoluciones</summary>
            <div className="dropdown-content">
              <p>
                Realizamos entregas en un plazo de 2 a 4 días hábiles. El costo de envío lo asume el cliente y la información personal será tratada con confidencialidad, 
                compartida únicamente con las empresas de mensajería. Aceptamos cambios por talla o defecto de fábrica dentro de los primeros 5 días hábiles, 
                siempre que la prenda esté sin uso, con etiquetas y en su estado original. Todos los productos cuentan con una garantía de 2 meses por defectos de fabricación, 
                excluyendo daños por mal uso, lavados inadecuados, modificaciones o desgaste natural. Los productos adquiridos en descuento no aplican para cambios..
              </p>
            </div>
          </details>
        </section>
      </main>
    </>
  );
};

export default ProductDetail;
