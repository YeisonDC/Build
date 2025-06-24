import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ajusta la ruta si es diferente
import { CartContext } from "../context/CartContext"; // ✅ Importar contexto del carrito
import API from '../api'; // ✅ Importar instancia axios configurada con baseURL
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const { session_id } = useContext(CartContext); // ✅ Obtener session_id del carrito

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Usamos axios (API) para hacer POST al login, con session_id incluido
      const { data } = await API.post('/usuarios/login', {
        correo: formData.correo,
        contraseña: formData.contraseña,
        session_id, // ✅ Enviar session_id junto al login
      });

      // Guarda usuario y token en contexto + localStorage
      login({ correo: formData.correo }, data.token);

      // Redirige con recarga completa de la página
      window.location.href = "/";
    } catch (err) {
      // Si axios lanza error, extraemos mensaje del backend o ponemos mensaje genérico
      setError(err.response?.data?.mensaje || "Correo o contraseña incorrectos");
    }
  };

  return (
    <main className="login-main">
      <section className="login-container">
        <h1 className="login-title">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="correo" className="login-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="login-input"
          />

          <label htmlFor="contraseña" className="login-label">
            Contraseña
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
            className="login-input"
          />

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="login-register-link">
            Regístrate aquí
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
