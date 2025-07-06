// src/pages/Terminos.jsx
import React from 'react';
import './Terminos.css';

// Función reutilizable para redirigir con recarga y scroll arriba
const irAConRecarga = (rutaHash) => {
  window.location.href = `/#${rutaHash}`;
  setTimeout(() => {
    window.scrollTo(0, 0);
    window.location.reload();
  }, 20);
};

const Terminos = () => {
  return (
    <div className="terminos-container">
      <h1>Términos y Condiciones</h1>

      <p>
        Bienvenido a <strong>Beubek</strong>. Al acceder a este sitio web y realizar una compra,
        aceptas los siguientes términos y condiciones. Te recomendamos leerlos detenidamente.
      </p>

      <h2>1. Información General</h2>
      <p>
        Beubek es una marca colombiana dedicada a la comercialización de prendas y accesorios.
        Al realizar una compra en nuestro sitio, confirmas que tienes al menos 18 años o cuentas
        con el permiso de tus padres o tutores.
      </p>

      <h2>2. Productos</h2>
      <p>
        Las imágenes y descripciones de nuestros productos son lo más precisas posible. Sin embargo,
        pueden existir ligeras variaciones de color o presentación debido a factores como iluminación,
        pantalla, o edición.
      </p>

      <h2>3. Precios y Pagos</h2>
      <ul>
        <li>Todos los precios están expresados en pesos colombianos (COP).</li>
        <li>Los métodos de pago disponibles serán los mostrados al finalizar la compra.</li>
        <li>Nos reservamos el derecho de actualizar precios sin previo aviso.</li>
      </ul>

      <h2>4. Envíos</h2>
      <p>
        Los envíos se realizan a través de transportadoras aliadas. El tiempo estimado de entrega
        es de 2 a 5 días hábiles, dependiendo de la ciudad. Los retrasos ocasionados por la transportadora
        están fuera de nuestro control.
      </p>

      <h2>5. Devoluciones</h2>
      <p>
        Consulta nuestra{' '}
        <span
          onClick={() => irAConRecarga('/devoluciones')}
          style={{ color: '#6e1212', cursor: 'pointer', textDecoration: 'underline' }}
        >
          política de devoluciones
        </span>{' '}
        para conocer las condiciones bajo las cuales se puede devolver un producto.
      </p>

      <h2>6. Propiedad Intelectual</h2>
      <p>
        Todos los contenidos de este sitio web (imágenes, textos, logos, diseños) son propiedad
        de Beubek y están protegidos por derechos de autor. No está permitida su reproducción sin autorización.
      </p>

      <h2>7. Privacidad</h2>
      <p>
        La información personal que proporcionas será tratada con confidencialidad. No compartimos
        datos con terceros, salvo para procesos relacionados con el envío o facturación.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
        Cualquier cambio se publicará en esta misma página.
      </p>

      <p>Gracias por confiar en nosotros. 💛</p>
    </div>
  );
};

export default Terminos;
