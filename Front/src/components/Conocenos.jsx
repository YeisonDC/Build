// src/pages/Conocenos.jsx

import React from 'react';
import './Conocenos.css';

const Conocenos = () => {
  return (
    <div className="conocenos-container">
      <h1>Conócenos</h1>

      <section className="intro">
        <p>
          En <strong>BEUBEK</strong> creemos que la moda va más allá de lo que se lleva puesto. Para nosotras, cada prenda es una declaración de identidad, una forma de empoderamiento y un acto de amor propio. Por eso, creamos piezas pensadas para resaltar lo más auténtico y poderoso de cada mujer.
        </p>
      </section>

      <section className="mision">
        <h2>Nuestra Misión</h2>
        <p>
          Diseñamos y creamos prendas que celebran la feminidad, la autenticidad y el poder interior de cada mujer. A través de piezas románticas, sensuales y estéticamente cuidadas, buscamos fortalecer la autoestima de nuestras clientas, acompañándolas a vestir su esencia con elegancia y confianza. Impulsamos una moda consciente, con pasos firmes hacia la sostenibilidad y un enfoque humano que valora la autenticidad de cada mujer.
        </p>
      </section>

      <section className="vision">
        <h2>Nuestra Visión</h2>
        <p>
          Ser una marca referente de la moda femenina en Colombia y Latinoamérica, reconocida por su identidad estética, su compromiso con el empoderamiento de las mujeres y su proyección internacional. Soñamos con llevar nuestras creaciones a grandes pasarelas, exportar estilo con propósito y formar un equipo apasionado —principalmente de mujeres— que viva y construya el universo BEUBEK.
        </p>
      </section>

      <section className="cierre">
        <p>
          Gracias por hacer parte de este sueño. BEUBEK es más que ropa: es una comunidad, una actitud, una forma de ser y de estar en el mundo.
        </p>
      </section>
    </div>
  );
};

export default Conocenos;