import React, { useState, useEffect } from 'react';
import './UpdateProduct.css';
import API from '../api';
import ProductPreview from '../components/ProductPreview';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/productos/${id}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar el producto:', err);
        toast.error('No se pudo cargar el producto');
        setLoading(false);
      });
  }, [id]);

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
      updated.colores[index].imagenes[subIndex] = e.target.value;
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

  // Agrega nueva imagen para color dado
  const addImagen = (colorIndex) => {
    const newColores = [...formData.colores];
    newColores[colorIndex].imagenes.push('');
    setFormData({ ...formData, colores: newColores });
  };

  // Elimina imagen específica de color dado
  const removeImagen = (colorIndex, imagenIndex) => {
    const newColores = [...formData.colores];
    if (newColores[colorIndex].imagenes.length === 1) return;
    newColores[colorIndex].imagenes.splice(imagenIndex, 1);
    setFormData({ ...formData, colores: newColores });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/productos/productos/${id}`, formData);
      toast.success('Producto actualizado exitosamente');
      // No navegamos fuera para mantener en la página
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Ocurrió un error al actualizar el producto');
    }
  };

  if (loading || !formData) {
    return <p style={{ padding: '2rem' }}>Cargando producto para editar...</p>;
  }

  return (
    <div className="create-product-wrapper">
      <Link to="/admin/productos" className="btn-back" title="Volver">
        <FaArrowLeft />
      </Link>

      <div className="create-product-container">
        <form onSubmit={handleSubmit} className="create-product-form">
          <h2>Editar Producto</h2>

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
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />

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
                  >
                    ×
                  </button>
                )}
              </h4>

              <input
                type="text"
                name="colorNombre"
                placeholder="Nombre del color"
                value={colorObj.color[0]}
                onChange={(e) => handleChange(e, 'colores', colorIndex)}
              />

              <input
                type="text"
                name="colorHex"
                placeholder="Código Hex"
                value={colorObj.color[1]}
                onChange={(e) => handleChange(e, 'colores', colorIndex)}
              />

              {/* Inputs para múltiples imágenes */}
              <label>Imágenes principales:</label>
              {colorObj.imagenes.map((imgUrl, imgIndex) => (
                <div
                  key={imgIndex}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
                >
                  <input
                    type="text"
                    placeholder={`URL imagen #${imgIndex + 1}`}
                    value={imgUrl}
                    onChange={(e) => handleChange(e, 'imagenes', colorIndex, imgIndex)}
                    style={{ flexGrow: 1 }}
                  />
                  {colorObj.imagenes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImagen(colorIndex, imgIndex)}
                      className="btn-remove btn-remove-color"
                      style={{ marginLeft: '8px', padding: '4px 10px' }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addImagen(colorIndex)}
                className="btn-add btn-add-color"
                style={{ marginBottom: '15px' }}
              >
                Agregar imagen
              </button>

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
                    placeholder="URL imagen talla (opcional)"
                    value={tallaObj.imagen}
                    onChange={(e) => handleChange(e, 'tallas', colorIndex, tallaIndex)}
                  />
                  {colorObj.tallas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTalla(colorIndex, tallaIndex)}
                      className="btn-remove btn-remove-talla"
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
            Actualizar producto
          </button>
        </form>

        <div className="product-preview-wrapper">
          <ProductPreview product={formData} />
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
