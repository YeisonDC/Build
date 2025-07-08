import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const mejorarCalidadCloudinary = (url, width, height) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_fill,dpr_auto,f_auto,q_auto/`
  );
};

const ProductCard = ({ product }) => {
  const hasValidData =
    product &&
    Array.isArray(product.colores) &&
    product.colores.length > 0 &&
    product.precio &&
    product.nombre;

  const [selectedColor, setSelectedColor] = useState(
    hasValidData ? product.colores[0].color : ''
  );

  if (!hasValidData) {
    return (
      <div className="p-4 border rounded shadow text-center text-gray-500">
        Producto incompleto
      </div>
    );
  }

  const selectedColorObj = product.colores.find(c =>
    JSON.stringify(c.color) === JSON.stringify(selectedColor)
  );

  const displayedImage =
    selectedColorObj?.imagenes?.[0] ||
    'https://via.placeholder.com/300x400?text=Sin+imagen';

  // Dimensiones que respetan la relación 4/5.5 para diferentes anchos:
  // Ejemplo: ancho 250px => alto = 250 * (5.5/4) = 343.75 aprox
  // Móvil 140px => alto = 140 * (5.5/4) = 192.5 aprox

  const aspectRatioHeight = (width) => Math.round(width * 5.5 / 4);

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 flex flex-col h-full w-[250px] max-w-full sm:w-[250px]">
      <Link to={`/producto/${product._id}`} className="block flex-shrink-0">
        <img
          src={mejorarCalidadCloudinary(displayedImage, 800, 1100)}
          srcSet={`
            ${mejorarCalidadCloudinary(displayedImage, 400, aspectRatioHeight(400))} 400w,
            ${mejorarCalidadCloudinary(displayedImage, 800, aspectRatioHeight(800))} 800w,
            ${mejorarCalidadCloudinary(displayedImage, 1200, aspectRatioHeight(1200))} 1200w
          `}
          sizes="(max-width: 768px) 140px, 250px"
          alt={`${product.nombre} - color ${selectedColor[0]}`}
          className="w-full object-cover rounded"
          style={{ aspectRatio: '4 / 5.5', height: 'auto' }}
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {/* Categorías con desplazamiento horizontal sin scroll visible */}
        <div className="flex flex-nowrap overflow-x-auto gap-[6px] mb-1 no-scrollbar">
          {Array.isArray(product.categoria) && product.categoria.length > 0 ? (
            product.categoria.map((cat, i) => (
              <span
                key={i}
                className="bg-[#eee] text-[#555] text-[0.75rem] px-[8px] py-[3px] rounded-full select-none whitespace-nowrap"
                title={cat}
              >
                {cat}
              </span>
            ))
          ) : (
            <span
              className="bg-[#eee] text-[#555] text-[0.75rem] px-[8px] py-[3px] rounded-full select-none whitespace-nowrap"
            >
              Sin categoría
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="text-[1rem] mt-1 mb-1 line-clamp-2 font-medium leading-snug">
          {product.nombre}
        </h3>

        {/* Colores + Precio */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex gap-[5px]">
            {product.colores.map((colorObj, index) => {
              const isSelected = JSON.stringify(selectedColor) === JSON.stringify(colorObj.color);
              return (
                <span
                  key={index}
                  onClick={() => setSelectedColor(colorObj.color)}
                  title={colorObj.color[0]}
                  className={`rounded-full cursor-pointer transition-transform 
                    ${isSelected ? 'border-[2px] border-black shadow-[0_0_3px_rgba(0,0,0,0.4)]' : 'border border-[#aaa]'} 
                    hover:border-[#333] hover:scale-105 
                    w-[14px] h-[14px] sm:w-[18px] sm:h-[18px]`}
                  style={{ backgroundColor: colorObj.color[1] }}
                />
              );
            })}
          </div>

          <p className="text-[0.95rem] font-normal text-right ml-auto leading-tight">
            {product.precio ? `$${product.precio.toLocaleString()}` : 'Precio no disponible'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
