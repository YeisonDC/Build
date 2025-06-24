import React, { useState } from 'react';
import './CreateProduct.css';
import API from '../api'; // Cambiado axios por la instancia API
import ProductPreview from '../components/ProductPreview';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: [''],
    descripcion: '',
    precio: '',
    colores: [
      {
        color: ['', ''], // [nombre, hex]
        imagenes: [''],
        tallas: [{ talla: '', stock: '', imagen: '' }],
      },
    ],
  });

  const handleChange = (e, path, index, subIndex) => {
    const updated = { ...formData };

    if (path === 'categoria') {
      updated.categoria[index] = e.target.value;
    } else if (path === 'colores') {
      if (e.target.name === 'colorNombre') {
        updated.colores[index].color[0] = e.target.value;
      } else if (e.target.name === 'colorHex') {
        updated.colores[index].color[1] = e.target.value;
      } else {
        updated.colores[index][e.target.name] = e.target.value;
      }
    } else if (path === 'imagenes') {
      updated.colores[index].imagenes[0] = e.target.value;
    } else if (path === 'tallas') {
      updated.colores[index].tallas[subIndex][e.target.name] = e.target.value;
    } else {
      updated[e.target.name] = e.target.value;
    }

    setFormData(updated);
  };

  const addCategoria = () => {
    setFormData({ ...formData, categoria: [...formData.categoria, ''] });
  };

  const removeCategoria = (index) => {
    if (formData.categoria.length === 1) return;
    const nuevasCategorias = formData.categoria.filter((_, i) => i !== index);
    setFormData({ ...formData, categoria: nuevasCategorias });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colores: [
        ...formData.colores,
        { color: ['', ''], imagenes: [''], tallas: [{ talla: '', stock: '', imagen: '' }] },
      ],
    });
  };

  const removeColor = (index) => {
    if (formData.colores.length === 1) return;
    const nuevosColores = formData.colores.filter((_, i) => i !== index);
    setFormData({ ...formData, colores: nuevosColores });
  };

  const addTalla = (index) => {
    const newColores = [...formData.colores];
    newColores[index].tallas.push({ talla: '', stock: '', imagen: '' });
    setFormData({ ...formData, colores: newColores });
  };

  const removeTalla = (colorIndex, tallaIndex) => {
    const newColores = [...formData.colores];
    if (newColores[colorIndex].tallas.length === 1) return;
    newColores[colorIndex].tallas.splice(tallaIndex, 1);
    setFormData({ ...formData, colores: newColores });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/productos', formData);  // <-- Usamos API aquí
      toast.success('Producto creado exitosamente');
      setFormData({
        nombre: '',
        categoria: [''],
        descripcion: '',
        precio: '',
        colores: [
          { color: ['', ''], imagenes: [''], tallas: [{ talla: '', stock: '', imagen: '' }] },
        ],
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Ocurrió un error al crear el producto');
    }
  };

  return (
    <div className="create-product-wrapper">
      <Link to="/perfil" className="btn-back" title="Volver a Perfil">
        <FaArrowLeft />
      </Link>

      <div className="create-product-container">
        <form onSubmit={handleSubmit} className="create-product-form">
          <h2>Crear Producto</h2>

          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>Categorías:</label>
          {formData.categoria.map((cat, index) => (
            <div key={index} className="categoria-row">
              <input
                type="text"
                value={cat}
                onChange={(e) => handleChange(e, 'categoria', index)}
                required
              />
              {formData.categoria.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategoria(index)}
                  className="btn-remove"
                  title="Eliminar categoría"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCategoria} className="btn-add">
            Agregar categoría
          </button>

          <label>Descripción:</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />

          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
          />

          {formData.colores.map((colorObj, colorIndex) => (
            <div key={colorIndex} className="color-section">
              <h4>
                Color #{colorIndex + 1}
                {formData.colores.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(colorIndex)}
                    className="btn-remove btn-remove-color"
                    title="Eliminar color"
                  >
                    ×
                  </button>
                )}
              </h4>

              <input
                type="text"
                name="colorNombre"
                placeholder="Nombre del color (Ej: Rojo)"
                value={colorObj.color[0]}
                onChange={(e) => handleChange(e, 'colores', colorIndex)}
              />

              <input
                type="text"
                name="colorHex"
                placeholder="Código Hexadecimal (Ej: #ff0000)"
                value={colorObj.color[1]}
                onChange={(e) => handleChange(e, 'colores', colorIndex)}
              />

              <input
                type="text"
                placeholder="URL de la imagen principal"
                value={colorObj.imagenes[0]}
                onChange={(e) => handleChange(e, 'imagenes', colorIndex)}
              />

              {colorObj.tallas.map((tallaObj, tallaIndex) => (
                <div key={tallaIndex} className="talla-section">
                  <h5>Talla #{tallaIndex + 1}</h5>
                  <input
                    type="text"
                    name="talla"
                    placeholder="Talla"
                    value={tallaObj.talla}
                    onChange={(e) => handleChange(e, 'tallas', colorIndex, tallaIndex)}
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={tallaObj.stock}
                    onChange={(e) => handleChange(e, 'tallas', colorIndex, tallaIndex)}
                  />
                  <input
                    type="text"
                    name="imagen"
                    placeholder="URL de imagen por talla (opcional)"
                    value={tallaObj.imagen}
                    onChange={(e) => handleChange(e, 'tallas', colorIndex, tallaIndex)}
                  />
                  {colorObj.tallas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTalla(colorIndex, tallaIndex)}
                      className="btn-remove btn-remove-talla"
                      title="Eliminar talla"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addTalla(colorIndex)}
                className="btn-add btn-add-talla"
              >
                Agregar talla
              </button>
            </div>
          ))}

          <button type="button" onClick={addColor} className="btn-add btn-add-color">
            Agregar color
          </button>

          <button type="submit" className="btn-submit">
            Crear producto
          </button>
        </form>

        <div className="product-preview-wrapper">
          <ProductPreview product={formData} />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
