import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Point, GeoResponse } from '@/types/coordinatesDto';
import { processPoints } from '@/services/api';

type FormValues = {
  lat: number;
  lng: number;
};

interface Props {
  onResult: (data: GeoResponse) => void;
}

export default function PointForm({ onResult }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPoint = (data: FormValues) => {
    setPoints(prev => [...prev, { lat: data.lat, lng: data.lng }]);
    reset();
  };

  const removePoint = (index: number) => {
    setPoints(prev => prev.filter((_, i) => i !== index));
  };

  const resetPoints = () => {
    setPoints([]);
    setError(null);
  };

  const onSubmitToAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await processPoints(points);
      onResult(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error al procesar los puntos.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Agregar coordenadas</h2>
      
      <form onSubmit={handleSubmit(addPoint)} className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="number"
            step="any"
            placeholder="Latitud (-90 a 90)"
            {...register('lat', { required: true, min: -90, max: 90 })}
            className="w-full border p-2 rounded"
          />
          {errors.lat && <span className="text-red-500 text-sm">Latitud inválida</span>}
        </div>

        <div className="flex-1">
          <input
            type="number"
            step="any"
            placeholder="Longitud (-180 a 180)"
            {...register('lng', { required: true, min: -180, max: 180 })}
            className="w-full border p-2 rounded"
          />
          {errors.lng && <span className="text-red-500 text-sm">Longitud inválida</span>}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Agregar
        </button>
      </form>

      {points.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Puntos ingresados:</h3>
          <ul className="space-y-2">
            {points.map((p, i) => (
              <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{`(${p.lat}, ${p.lng})`}</span>
                <button
                  onClick={() => removePoint(i)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={onSubmitToAPI}
          disabled={points.length === 0 || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Procesar'}
        </button>

        <button
          onClick={resetPoints}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Limpiar
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}