// src/components/TopBanner.jsx
import React, { useState } from 'react';
import './TopBanner.css';
import { IoClose } from 'react-icons/io5';

const TopBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="top-banner">
      <p>🎉 ¡Envío gratis por compras mayores a $300.000!</p>
      <button className="close-btn" onClick={() => setVisible(false)} title="Cerrar">
        <IoClose size={20} />
      </button>
    </div>
  );
};

export default TopBanner;