import React from 'react';
import ProductEditCard from './ProductEditCard';
import './AdminProductList.css';

const AdminProductList = ({ products, onProductUpdate, onProductDelete }) => {
  if (!products.length) return <p>No hay productos para mostrar.</p>;

  return (
    <div className="admin-grid">
      {products.map(producto => (
        <ProductEditCard
          key={producto._id}
          product={producto}
          onProductUpdate={onProductUpdate}
          onDelete={onProductDelete}
        />
      ))}
    </div>
  );
};

export default AdminProductList;
