import React from 'react';
// Cambié BrowserRouter por HashRouter para evitar problemas de recarga en hosting estático
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import Home from './components/Home';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail'; 
import CategoryPage from './pages/CategoryPage';
import Login from './components/Login';
import Register from './components/Register';
import Perfil from './pages/Perfil';
import AuthProvider from './context/AuthContext.jsx';
import CreateProduct from './pages/CreateProduct';  // Crear producto
import ProductEdit from './pages/ProductEdit';      // Editar productos (Admin)
import UpdateProduct from './pages/UpdateProduct';
import PagoCheckout from './components/PagoCheckout';
import PagoExitoso from './components/PagoExitoso.jsx';
import TodosLosPedidos from './pages/TodosLosPedidos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Devoluciones from './components/Devoluciones.jsx';
import Terminos from './components/Terminos.jsx';
import Conocenos from './components/Conocenos.jsx';


function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/categoria/:categoria" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/crear-producto" element={<CreateProduct />} />
            <Route path="/editar-producto/:id" element={<UpdateProduct />} />
            <Route path="/admin/productos" element={<ProductEdit />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago" element={<PagoCheckout />} />
            <Route path="/admin/pedidos" element={<TodosLosPedidos />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/conocenos" element={<Conocenos/>} />
          </Routes>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
