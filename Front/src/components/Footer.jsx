import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png'; // Usa tu logo real
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import { Link} from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Beubek Logo" />
        </div>

        <div className="footer-links">
          <h4>Beubek</h4>
          <ul>
            <li><a href="/conocenos">Conócenos</a></li>
            <li><link to="/devoluciones">Devoluciones</link></li>
            <li><a href="/terminos">Términos y condiciones</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/beubek.col?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@beubek.b?_t=ZS-8wumOpANrVp&_r=1" target="_blank" rel="noreferrer"><FaTiktok /></a>
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