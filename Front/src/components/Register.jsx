import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // ✅ Importar contexto para obtener session_id
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",       // Cambié name por nombre
    correo: "",       // Cambié email por correo
    contraseña: "",   // password por contraseña
    confirmPassword: "",
    documento: "",    // Agregado campo documento para el modelo, aunque vacío por ahora
  });
  const [error, setError] = useState(null);

  const { session_id } = useContext(CartContext); // ✅ Obtener session_id del contexto
  const navigate = useNavigate();

  // ✅ URL dinámica del backend desde variable de entorno
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.contraseña !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contraseña: formData.contraseña,
          documento: formData.documento || "",      // Envíalo aunque esté vacío
          session_id,   // ✅ Enviar session_id para asociar carrito anónimo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Error al registrar usuario");
        return;
      }

      // Registro exitoso: token recibido
      console.log("Usuario registrado, token:", data.token);
      localStorage.setItem("token", data.token);

      // Aquí puedes redirigir a login o a otra página
      navigate('/'); // ✅ Redirigir al home u otra ruta

    } catch (err) {
      setError("Error de conexión al servidor");
    }
  };

  return (
    <main className="register-main">
      <section className="register-container">
        <h1 className="register-title">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {/* Si quieres que el usuario ingrese documento, descomenta esto: */}
          
          <label htmlFor="documento">Documento</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          /> 

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>

        {error && <p className="register-error">{error}</p>}

        <p className="register-login-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="register-login-link">
            Inicia sesión aquí
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
