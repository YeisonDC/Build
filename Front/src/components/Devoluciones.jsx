// src/pages/Devoluciones.jsx

import React from 'react';
import './Devoluciones.css';

const Devoluciones = () => {
  return (
    <div className="devoluciones-container">
      <h1>Política de Devoluciones</h1>
      <p>
        En <strong>Beubek</strong>, queremos que estés completamente satisfecho con tu compra. 
        Si por alguna razón no estás conforme con tu pedido, puedes solicitar una devolución dentro de los primeros <strong>7 días hábiles</strong> después de haber recibido tu producto.
      </p>
      
      <h2>¿Cuándo aplica una devolución?</h2>
      <ul>
        <li>El producto llegó defectuoso o dañado.</li>
        <li>Recibiste un artículo diferente al solicitado.</li>
        <li>El producto presenta fallas de fabricación.</li>
      </ul>

      <h2>Condiciones para aceptar devoluciones</h2>
      <ul>
        <li>El producto debe estar sin uso, en perfectas condiciones y en su empaque original.</li>
        <li>Debes presentar el comprobante de compra (factura o número de pedido).</li>
      </ul>

      <h2>¿Cómo solicito una devolución?</h2>
      <p>
        Por favor, envíanos un correo a <strong>infobeubek@gmail.com</strong> con la siguiente información:
      </p>
      <ul>
        <li>Nombre completo</li>
        <li>Número de pedido</li>
        <li>Motivo de la devolución</li>
        <li>Fotos del producto (si aplica)</li>
      </ul>

      <p>
        Nuestro equipo te responderá en un plazo máximo de <strong>48 horas hábiles</strong> para indicarte los pasos a seguir.
      </p>

      <h2>Gastos de envío</h2>
      <p>
        Los gastos de envío por devolución corren por cuenta del cliente, salvo en los casos en que el error haya sido nuestro.
      </p>

      <p>
        Gracias por confiar en Beubek 💛
      </p>
    </div>
  );
};

export default Devoluciones;