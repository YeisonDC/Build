import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmPassword: "",
    documento: "",
    tratamiento_datos: false,
    boletin: false,
  });
  const [mostrarPolitica, setMostrarPolitica] = useState(false);
  const [error, setError] = useState(null);

  const { session_id } = useContext(CartContext);
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.contraseña !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/verificacion/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contraseña: formData.contraseña,
          documento: formData.documento || "",
          tratamiento_datos: formData.tratamiento_datos,
          boletin: formData.boletin,
          session_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Error al solicitar verificación");
        return;
      }

      // ✅ Navegar a la pantalla de verificación
      navigate("/verificar", {
        state: {
          correo: formData.correo,
          session_id,
        },
      });
    } catch (err) {
      setError("Error de conexión al servidor");
    }
  };

  return (
    <main className="min-h-[80vh] flex justify-center items-center px-5 bg-white">
      <section className="max-w-md w-full border border-gray-300 p-8 shadow-md rounded bg-white">
        <h1 className="text-3xl text-[#6e1212] mb-6 text-center font-bold">
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block font-semibold text-gray-800 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212]"
            />
          </div>

          <div>
            <label htmlFor="correo" className="block font-semibold text-gray-800 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212]"
            />
          </div>

          <div>
            <label htmlFor="contraseña" className="block font-semibold text-gray-800 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-800 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212]"
            />
          </div>

          <div>
            <label htmlFor="documento" className="block font-semibold text-gray-800 mb-1">
              Documento
            </label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212]"
            />
          </div>

          <div className="mt-4 text-sm">
            <button
              type="button"
              onClick={() => setMostrarPolitica(!mostrarPolitica)}
              className="text-[#6e1212] font-semibold hover:underline"
            >
              Política de Tratamiento de la Información – Beubek
            </button>

            {mostrarPolitica && (
              <div className="bg-gray-100 border border-gray-300 rounded p-4 mt-3 text-gray-800 text-sm">
                <p>
                  Autorizo de manera libre, previa, expresa e informada a
                  Beubek S.A.S. para que recolecte, almacene, use, circule y
                  suprima mis datos personales conforme a su Política de
                  Tratamiento de la Información, con el fin de prestar sus
                  servicios, gestionar comunicaciones, realizar análisis
                  internos y cumplir con obligaciones legales y contractuales.
                </p>
                <p className="mt-2">Declaro que he sido informado sobre:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>El tratamiento que se dará a mis datos personales.</li>
                  <li>Mis derechos como titular de la información.</li>
                  <li>Los canales disponibles para ejercerlos.</li>
                </ul>
              </div>
            )}

            <label className="flex items-center gap-2 mt-4 text-gray-800 text-sm">
              <input
                type="checkbox"
                name="tratamiento_datos"
                checked={formData.tratamiento_datos}
                onChange={handleChange}
                className="accent-[#6e1212] w-4 h-4 mt-0.5"
              />
              <span>
                Acepto el tratamiento de mis datos personales conforme a lo anterior.
              </span>
            </label>

            <label className="flex items-center gap-2 mt-2 text-gray-800 text-sm">
              <input
                type="checkbox"
                name="boletin"
                checked={formData.boletin}
                onChange={handleChange}
                className="accent-[#6e1212] w-4 h-4 mt-0.5"
              />
              <span>
                Deseo suscribirme al boletín de Beubek para recibir novedades, descuentos exclusivos y promociones especiales.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#6e1212] text-white py-3 text-lg font-semibold hover:bg-[#570a0a] transition-colors"
          >
            Registrarse
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <p className="text-center text-sm mt-5 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#6e1212] font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
