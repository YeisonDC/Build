import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode"; // Para decodificar token JWT
import { toast } from "react-toastify"; // Para mostrar mensajes toast

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para verificar expiración del token y programar cierre automático
  const verificarExpiracionToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const tiempoRestante = decoded.exp * 1000 - Date.now();

        if (tiempoRestante <= 0) {
          // Si el token ya expiró
          cerrarSesionConMensaje();
        } else {
          // Si el token sigue válido, programar el cierre justo cuando expire
          setTimeout(() => {
            cerrarSesionConMensaje();
          }, tiempoRestante);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        logout(); // En caso de error al decodificar, cerrar sesión
      }
    }
  };

  // Función que muestra toast y cierra sesión
  const cerrarSesionConMensaje = () => {
    toast.warning("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
    logout();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Aquí podrías usar fetch para validar el token en el backend
      // Supongamos que es válido por ahora:
      const storedUser = JSON.parse(localStorage.getItem("user")); // si guardaste más info
      setUser(storedUser || { token }); // preferiblemente con más datos reales

      // Verificamos y programamos el cierre de sesión automático
      verificarExpiracionToken();
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Verificamos y programamos el cierre automático tras login
    verificarExpiracionToken();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ← ¡importante si guardaste más cosas!
    window.location.href = "/login"; // Opcional: redirigir a login al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
