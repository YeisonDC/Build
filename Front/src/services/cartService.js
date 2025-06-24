// services/cartService.js

// ✅ URL dinámica del backend desde variable de entorno
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const addProductToBackendCart = async (producto) => {
  const token = localStorage.getItem('token'); // Asegúrate que el usuario esté logueado

  if (!token) {
    console.warn('No hay token disponible, el usuario no está autenticado');
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/carrito`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(producto),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error al agregar al carrito en el backend:', data);
    } else {
      console.log('Producto agregado al carrito del backend:', data);
    }
  } catch (error) {
    console.error('Error en la petición al backend:', error);
  }
};
