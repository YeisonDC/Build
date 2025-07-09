import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Verificar = () => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const correo = location.state?.correo;
  const session_id = location.state?.session_id;

  if (!correo || !session_id) {
    return (
      <main className="min-h-[80vh] flex justify-center items-center px-5 bg-white">
        <section className="max-w-md w-full border border-gray-300 p-8 shadow-md rounded bg-white text-center">
          <h2 className="text-xl font-semibold text-[#6e1212] mb-4">
            Información incompleta
          </h2>
          <p className="text-gray-700">
            No se pudo cargar la verificación. Por favor regístrate nuevamente.
          </p>
        </section>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const response = await fetch(`${backendUrl}/verificacion/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, codigo, session_id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Error al verificar el código");
        setEnviando(false);
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError("Error de conexión con el servidor");
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex justify-center items-center px-5 bg-white">
      <section className="max-w-md w-full border border-gray-300 p-8 shadow-md rounded bg-white">
        <h1 className="text-2xl font-bold text-center text-[#6e1212] mb-6">
          Verifica tu correo
        </h1>
        <p className="text-gray-700 text-sm mb-6 text-center">
          Ingresa el código de 6 dígitos que te enviamos a <strong>{correo}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de verificación"
            required
            maxLength={6}
            className="w-full px-3 py-2 text-base border border-gray-400 rounded focus:outline-none focus:border-[#6e1212] text-center tracking-widest"
          />

          <button
            type="submit"
            disabled={enviando}
            className={`w-full py-3 text-lg font-semibold text-white rounded transition-colors ${
              enviando ? "bg-gray-400 cursor-not-allowed" : "bg-[#6e1212] hover:bg-[#570a0a]"
            }`}
          >
            {enviando ? "Verificando..." : "Verificar código"}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </section>
    </main>
  );
};

export default Verificar;
