import { jwtDecode } from 'jwt-decode';

export const obtenerRol = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.rol || null;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
