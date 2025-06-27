import React, { createContext, useState, useEffect } from 'react';
import API from '../api'; // ✅ Importar instancia axios configurada con baseURL y token

// Crear el contexto global del carrito
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // JWT si el usuario está autenticado
  let session_id = localStorage.getItem('session_id');

  // Si no hay session_id (usuario anónimo), generamos uno
  if (!token && !session_id) {
    session_id = crypto.randomUUID();
    localStorage.setItem('session_id', session_id);
  }

  // Helper para extraer id correctamente
  const extractId = (producto_id) =>
    typeof producto_id === 'object' && producto_id !== null
      ? producto_id._id
      : producto_id;

  // Obtener el carrito desde el backend
  const fetchCart = async () => {
    try {
      const res = await API.get('/carrito/', {
        params: !token ? { session_id } : {}
      });

      const productosFormateados = res.data.productos.map(p => ({
        id: extractId(p.producto_id),
        name: p.nombre || '',
        color: p.color,
        size: p.talla,
        quantity: p.cantidad,
        price: p.precio_total,
        image: p.imagen || '' // ⬅️ Nueva propiedad
      }));

      setCartItems(productosFormateados);
    } catch (error) {
      console.error('Error al cargar el carrito:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Agregar un producto al carrito
  const addToCart = async (product) => {
    try {
      const body = {
        producto_id: product.id,
        color: product.color,
        talla: product.size,
        cantidad: 1,
        imagen: product.image, // ✅ Imagen de la talla seleccionada
        ...(token ? {} : { session_id }) // Solo lo envías si no hay token
      };

      const res = await API.post('/carrito/agregar', body);

      const productosFormateados = res.data.carrito.productos.map(p => ({
        id: extractId(p.producto_id),
        name: p.nombre || '',
        color: p.color,
        size: p.talla,
        quantity: p.cantidad,
        price: p.precio_total,
        image: p.imagen || '' // ⬅️ Nueva propiedad
      }));

      setCartItems(productosFormateados);
    } catch (error) {
      console.error('Error al agregar al carrito:', error.message);
    }
  };

  // Eliminar un producto del carrito
  const removeFromCart = async (producto_id, color, talla) => {
    try {
      const body = {
        producto_id,
        color,
        talla,
        ...(token ? {} : { session_id })
      };

      const res = await API.delete('/carrito/eliminar', { data: body });

      const productosFormateados = res.data.carrito.productos.map(p => ({
        id: extractId(p.producto_id),
        name: p.nombre || '',
        color: p.color,
        size: p.talla,
        quantity: p.cantidad,
        price: p.precio_total,
        image: p.imagen || '' // ⬅️ Nueva propiedad
      }));

      setCartItems(productosFormateados);
    } catch (error) {
      console.error('Error al eliminar del carrito:', error.message);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (producto_id, color, talla, cantidad) => {
    try {
      const body = {
        producto_id,
        color,
        talla,
        cantidad,
        ...(token ? {} : { session_id })
      };

      const res = await API.put('/carrito/actualizar', body);

      const productosFormateados = res.data.carrito.productos.map(p => ({
        id: extractId(p.producto_id),
        name: p.nombre || '',
        color: p.color,
        size: p.talla,
        quantity: p.cantidad,
        price: p.precio_total,
        image: p.imagen || ''
      }));

      setCartItems(productosFormateados);
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error.message);
    }
  };

  // Nueva función para calcular total
  const calcularTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // 📦 Cargar el carrito al iniciar
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        loading,
        fetchCart,
        session_id, // ✅ Exportamos session_id para que Login/Registro lo puedan usar
        calcularTotal // <-- Aquí exportamos la función para usar el total donde quieras
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
