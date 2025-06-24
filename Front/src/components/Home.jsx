import React from 'react';
import './Home.css';
import TopBanner from './TopBanner'; // <-- Importación del banner
import imgIzquierda from '../assets/imagen-izquierda.jpg';
import imgDerecha from '../assets/imagen-derecha.jpg';
import infoImagen from '../assets/info-imagen.jpg';
import { FaWhatsapp } from 'react-icons/fa';

const Home = () => {
  return (
    <>
      <TopBanner /> {/* <-- Aquí se muestra el banner superior */}

      <div className="hero-section">
        <div className="imagen-con-overlay">
          <img src={imgIzquierda} alt="Izquierda" className="imagen" />
          <div className="overlay"></div>
        </div>
        <div className="imagen-con-overlay">
          <img src={imgDerecha} alt="Derecha" className="imagen" />
          <div className="overlay"></div>
        </div>
        <div className="mensaje-central">
          <h1>Viste a la moda</h1>
          <p>Descubre nuestra nueva colección</p>
        </div>
      </div>

      <div className="info-section">
        <div className="info-texto">
          <h2>En Beubek fusionamos creatividad, moda y elegancia</h2>
          <p>
            Nuestra nueva colección está inspirada en la belleza natural, combinando diseño contemporáneo
            con detalles únicos. Explora piezas pensadas para destacar tu estilo personal.
          </p>
        </div>
        <div className="info-imagen">
          <img src={infoImagen} alt="Colección" />
        </div>
      </div>

      <div className="newsletter-section">
        <div className="newsletter-contenido">
          <h2>¡Obtén 10% de descuento en tu primera compra!</h2>
          <p>Suscríbete a nuestro boletín y recibe promociones exclusivas.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu E-mail" required />
            <button type="submit">Suscribirme</button>
          </form>
        </div>
        <div className="newsletter-imagen">
          <img src={require('../assets/newsletter-imagen.jpg')} alt="Descuento" />
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://api.whatsapp.com/send?phone=573169056704"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button-home"
      >
        <FaWhatsapp size={36} />
        <span className="tooltip-text">Habla con un asesor 📱</span>
      </a>
    </>
  );
};

export default Home;