import React, { useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import { FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import SubmenuPortal from './SubmenuPortal';

/* ─── Mejorar calidad Cloudinary ───────────────────────── */
const mejorarCalidadCloudinary = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    "/upload/w_400,h_500,c_fill,dpr_auto,f_auto,q_auto/"
  );
};

/* ─── Definición de menús ──────────────────────────────── */
const MENUS = {
  nueva: {
    label: 'Nueva Colección',
    items: [{ label: 'El Jardin', path: '/categoria/eljardin' }],
    images: [
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1751586643/Set_Camelia_Talla_XS_2_xx4jad.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748754350/Set_Gardenia_Talla_S_2_lfzal9.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1749099613/Set_Peonia_Talla_L_2_yfl53d.jpg")
    ],
  },
  superiores: {
    label: 'Prendas Superiores',
    items: [
      { label: 'Tops', path: '/categoria/tops' },
      { label: 'Chalecos', path: '/categoria/chalecos' },
      { label: 'Blusas', path: '/categoria/blusas' },
      { label: 'Camisetas', path: '/categoria/camisetas' },
      { label: 'Bodys', path: '/categoria/bodys' },
      { label: 'Busos', path: '/categoria/busos' },
      { label: 'Corset', path: '/categoria/corset' },
    ],
    images: [
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1749163114/IMG_1200_o3epmo.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748750647/Set_Dalia_Talla_S_2_jfh3oc.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748731587/Camisa_AuroraTalla_S_jkk3ks.jpg")
    ],
  },
  inferiores: {
    label: 'Prendas inferiores ',
    items: [
      { label: 'Pantalones en tela', path: '/categoria/pantalones-en-tela' },
      { label: 'Jeans', path: '/categoria/jeans' },
      { label: 'shorts', path: '/categoria/shorts' },
      { label: 'faldas', path: '/categoria/faldas' },
    ],
    images: [
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748732902/Pant_Bogota_Talla_6_afjriy.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748744041/Pant_Bucaramanga_Talla_12_mk1vys.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748745212/Pant_En_Tela_Denver_Talla_M_m7zp6o.jpg")
    ],
  },
  totallook: {
    label: 'Total Look',
    items: [
      { label: 'Sets', path: '/categoria/sets' },
      { label: 'Vestidos', path: '/categoria/vestidos' },
      { label: 'Enterizos', path: '/categoria/enterizos' },
    ],
    images: [
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748747491/Set_Amapola_Talla_S_2_sqxufu.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1748749306/Set_California_Talla_L_2_wmwq0f.jpg"),
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1749098324/Set_Magnolia_Talla_S_uwetrq.jpg")
    ],
  },
  sale: {
    label: 'Sale',
    items: [{ label: 'Pendiente', path: '/categoria/pendiente' }],
    images: [
      mejorarCalidadCloudinary("https://res.cloudinary.com/dvj1tw3ui/image/upload/v1751591610/pendiente1_ndarie.jpg")
    ],
  },
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownTimeout = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const cantidadTotal = cartItems.reduce((tot, it) => tot + it.quantity, 0);

  const handleEnter = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 250);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    window.location.href = '/'; // 🔄 Recargar completamente la página al cerrar sesión
  };

  // NUEVO: Manejo con delay para dropdown usuario
  const openUserDropdown = () => {
    if (userDropdownTimeout.current) clearTimeout(userDropdownTimeout.current);
    setUserDropdownOpen(true);
  };

  const closeUserDropdown = () => {
    userDropdownTimeout.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 300); // delay para que no se cierre inmediatamente
  };

  const cancelCloseUserDropdown = () => {
    if (userDropdownTimeout.current) clearTimeout(userDropdownTimeout.current);
  };

  const Submenu = ({ menuKey }) => {
    if (activeMenu !== menuKey) return null;
    const { items, images = [] } = MENUS[menuKey];

    return (
      <SubmenuPortal>
        <div
          className="submenu"
          onMouseEnter={() => handleEnter(menuKey)}
          onMouseLeave={handleLeave}
        >
          <ul className="submenu-list">
            {items.map(({ label, path }) => (
              <li key={label}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>

          {images.length > 0 && (
            <div className="submenu-gallery">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`${menuKey}-${i}`} className="submenu-img" />
              ))}
            </div>
          )}
        </div>
      </SubmenuPortal>
    );
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Beubek Logo" className="logo-img" />
        </Link>
      </div>

      {/* Botón hamburguesa móvil */}
      <button
        className="menu-toggle"
        onClick={() => {
          setIsMobileMenuOpen(!isMobileMenuOpen);
          setMobileSubmenuOpen(null);
        }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Menú desktop */}
      <ul className="navbar-center">
        {Object.keys(MENUS).map((key) => (
          <li
            key={key}
            className="dropdown"
            onMouseEnter={() => handleEnter(key)}
            onMouseLeave={handleLeave}
          >
            <span>{MENUS[key].label}</span>
            <Submenu menuKey={key} />
          </li>
        ))}
      </ul>

      {/* Acciones derecha */}
      <ul className="navbar-right nav-links">
        <li className="nav-item">
          <Link to="/productos" className="nav-link">Productos</Link>
        </li>
        <li className="nav-item">
          <button
            className="nav-link carrito-icon-container"
            onClick={() => navigate("/carrito")}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FiShoppingBag size={20} />
            {cantidadTotal > 0 && (
              <span className="carrito-contador">{cantidadTotal}</span>
            )}
          </button>
        </li>

        {/* Usuario con dropdown */}
        <li
          className="nav-item usuario-dropdown"
          style={{ position: 'relative' }}
          onMouseEnter={openUserDropdown}
          onMouseLeave={closeUserDropdown}
        >
          <button
            className="nav-link usuario-icon-container"
            onClick={() => {
              if (!user) navigate('/login');
            }}
            type="button"
            aria-haspopup="true"
            aria-expanded={userDropdownOpen}
          >
            <FiUser size={20} />
          </button>

          {user && userDropdownOpen && (
            <div
              className="usuario-dropdown-menu"
              role="menu"
              onMouseEnter={cancelCloseUserDropdown}
              onMouseLeave={closeUserDropdown}
            >
              <Link
                to="/perfil"
                className="dropdown-item con-icono"
                onClick={() => setUserDropdownOpen(false)}
              >
                <FiUser className="dropdown-icon" />
                Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="dropdown-item con-icono logout"
                type="button"
              >
                <FiLogOut className="dropdown-icon" />
                Cerrar sesión
              </button>
            </div>
          )}
        </li>
      </ul>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {Object.keys(MENUS).map((key) => (
            <div key={key}>
              <div
                className="mobile-link"
                onClick={() =>
                  setMobileSubmenuOpen(mobileSubmenuOpen === key ? null : key)
                }
                style={{ cursor: 'pointer' }}
              >
                {MENUS[key].label}
              </div>
              {mobileSubmenuOpen === key && (
                <ul className="mobile-submenu">
                  {MENUS[key].items.map(({ label, path }) => (
                    <li key={label}>
                      <Link
                        to={path}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setMobileSubmenuOpen(null);
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <hr />

          {/* Usuario en móvil */}
          {user ? (
            <>
              <Link
                to="/perfil"
                className="mobile-link con-icono"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiUser className="dropdown-icon" />
                Perfil
              </Link>
              <button
                className="mobile-link con-icono"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiLogOut className="dropdown-icon" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Iniciar sesión / Registro
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
