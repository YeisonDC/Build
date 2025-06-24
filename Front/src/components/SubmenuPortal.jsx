// SubmenuPortal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const SubmenuPortal = ({ children }) => {
  const portalRoot = document.getElementById('submenu-root');
  return portalRoot ? ReactDOM.createPortal(children, portalRoot) : null;
};

export default SubmenuPortal;