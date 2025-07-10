import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { FiTrash } from 'react-icons/fi';

const AdministrarCupon = () => {
  const [cupones, setCupones] = useState([]);
  const [editando, setEditando] = useState({});

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const res = await API.get('/cupones/todos');
        setCupones(res.data);
      } catch (err) {
        toast.error('Error al cargar cupones');
      }
    };

    fetchCupones();
  }, []);

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setCupones(prev =>
      prev.map(c => (c._id === id ? { ...c, [name]: value } : c))
    );
    setEditando(prev => ({ ...prev, [id]: true }));
  };

  const handleToggleActivo = id => {
    setCupones(prev =>
      prev.map(c => (c._id === id ? { ...c, activo: !c.activo } : c))
    );
    setEditando(prev => ({ ...prev, [id]: true }));
  };

  const handleGuardar = async cupon => {
    try {
      await API.put(`/cupones/editar/${cupon._id}`, {
        codigo: cupon.codigo,
        tipo: cupon.tipo,
        descuento: cupon.descuento,
        activo: cupon.activo,
        usos_disponibles: cupon.usos_disponibles,
        fecha_expiracion: cupon.fecha_expiracion,
      });
      toast.success('Cupón actualizado');
      setEditando(prev => ({ ...prev, [cupon._id]: false }));
    } catch (err) {
      toast.error('Error al actualizar el cupón');
    }
  };

  const handleEliminar = async cupon => {
    toast.dismiss();
    toast(
      ({ closeToast }) => (
        <div className="text-sm">
          <p>¿Estás seguro de eliminar el cupón <b>{cupon.codigo}</b>?</p>
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded"
              onClick={async () => {
                try {
                  await API.delete(`/cupones/eliminar/${cupon._id}`);
                  setCupones(prev => prev.filter(c => c._id !== cupon._id));
                  toast.success('Cupón eliminado');
                  closeToast();
                } catch (err) {
                  toast.error('Error al eliminar el cupón');
                }
              }}
            >
              Sí, eliminar
            </button>
            <button
              className="px-3 py-1 border rounded"
              onClick={closeToast}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Administrar Cupones</h2>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-[900px] bg-white shadow-md rounded border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Descuento</th>
              <th className="px-4 py-2">Usos disponibles</th>
              <th className="px-4 py-2">Expira</th>
              <th className="px-4 py-2">Activo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cupones.map(cupon => (
              <tr key={cupon._id} className="border-t border-gray-200 text-sm">
                <td className="px-4 py-2">
                  <input
                    name="codigo"
                    value={cupon.codigo}
                    onChange={e => handleInputChange(e, cupon._id)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    name="tipo"
                    value={cupon.tipo}
                    onChange={e => handleInputChange(e, cupon._id)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="una_vez_total">Una vez total</option>
                    <option value="una_vez_por_usuario">Una vez por usuario</option>
                    <option value="cantidad_limitada">Cantidad limitada</option>
                    <option value="permanente">Permanente</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    name="descuento"
                    type="number"
                    value={cupon.descuento}
                    onChange={e => handleInputChange(e, cupon._id)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    name="usos_disponibles"
                    type="number"
                    value={cupon.usos_disponibles || ''}
                    onChange={e => handleInputChange(e, cupon._id)}
                    className="border rounded px-2 py-1 w-full"
                    disabled={cupon.tipo !== 'cantidad_limitada'}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    name="fecha_expiracion"
                    type="date"
                    value={cupon.fecha_expiracion ? cupon.fecha_expiracion.slice(0, 10) : ''}
                    onChange={e => handleInputChange(e, cupon._id)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={cupon.activo}
                    onChange={() => handleToggleActivo(cupon._id)}
                  />
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleGuardar(cupon)}
                    disabled={!editando[cupon._id]}
                    className={`px-3 py-1 rounded text-white ${
                      editando[cupon._id]
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => handleEliminar(cupon)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar cupón"
                  >
                    <FiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {cupones.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No hay cupones registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministrarCupon;
