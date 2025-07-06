import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const handleLinkClick = (ruta) => {
    window.scrollTo(0, 0);
    window.location.hash = `#${ruta}`; // ← ✅ cambia a hash para soporte con HashRouter
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Beubek Logo" />
        </div>

        <div className="footer-links">
          <h4>Beubek</h4>
          <ul>
            <li><span onClick={() => handleLinkClick('/conocenos')}>Conócenos</span></li>
            <li><span onClick={() => handleLinkClick('/devoluciones')}>Devoluciones</span></li>
            <li><span onClick={() => handleLinkClick('/terminos')}>Términos y condiciones</span></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/beubek.col?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@beubek.b?_t=ZS-8wumOpANrVp&_r=1" target="_blank" rel="noreferrer" title="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-copy">
        <p>&copy; {new Date().getFullYear()} Beubek. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
