import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ajusta la ruta si es diferente
import { CartContext } from "../context/CartContext"; // ✅ Importar contexto del carrito
import API from '../api'; // ✅ Importar instancia axios configurada con baseURL

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });
  const [recordarme, setRecordarme] = useState(false); // ✅ Estado para "recordarme"
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const { session_id } = useContext(CartContext); // ✅ Obtener session_id del carrito

  // ✅ Cargar datos guardados si existen
  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoRecordado");
    const contraseñaGuardada = localStorage.getItem("contraseñaRecordada");

    if (correoGuardado && contraseñaGuardada) {
      setFormData({
        correo: correoGuardado,
        contraseña: contraseñaGuardada,
      });
      setRecordarme(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name === "email" ? "correo" : "contraseña"]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await API.post('/usuarios/login', {
        correo: formData.correo,
        contraseña: formData.contraseña,
        session_id, // ✅ Enviar session_id junto al login
      });

      // ✅ Guardar o limpiar localStorage según el checkbox
      if (recordarme) {
        localStorage.setItem("correoRecordado", formData.correo);
        localStorage.setItem("contraseñaRecordada", formData.contraseña);
      } else {
        localStorage.removeItem("correoRecordado");
        localStorage.removeItem("contraseñaRecordada");
      }

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
    <main className="min-h-[80vh] flex justify-center items-center px-5 bg-white font-sans text-[#6e1212]">
      <section className="w-full max-w-md border border-gray-300 shadow-md px-6 py-8">
        <h1 className="text-center text-xl font-semibold mb-5">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col" autoComplete="on">
          <label htmlFor="correo" className="mb-1 font-semibold">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo"
            name="email" // ✅ nombre reconocido por los navegadores
            autoComplete="email" // ✅ sugerencia para autocompletar correo
            value={formData.correo}
            onChange={handleChange}
            required
            className="px-3 py-2 mb-4 border border-gray-300 text-base outline-none focus:border-[#6e1212]"
          />

          <label htmlFor="contraseña" className="mb-1 font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            id="contraseña"
            name="password" // ✅ nombre reconocido por los navegadores
            autoComplete="current-password" // ✅ para sugerencia de contraseña
            value={formData.contraseña}
            onChange={handleChange}
            required
            className="px-3 py-2 mb-4 border border-gray-300 text-base outline-none focus:border-[#6e1212]"
          />

          {/* ✅ Checkbox para recordar datos */}
          <div className="flex items-start mb-4 gap-2">
            <input
              type="checkbox"
              id="recordarme"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <label htmlFor="recordarme" className="text-sm">
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            className="py-3 bg-[#6e1212] text-white font-semibold text-base transition-colors hover:bg-[#520909] cursor-pointer"
          >
            Entrar
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <p className="mt-5 text-sm text-gray-600 text-center">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-[#6e1212] font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
