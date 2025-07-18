import { GeoResponse } from '@/types/coordinatesDto';

interface Props {
  result: GeoResponse;
}

export default function ResultsPanel({ result }: Props) {
  const { centroid, bounds } = result;

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h3 className="text-lg font-semibold mb-2">📍 Resultados</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold">Centroide:</h4>
          <p>Latitud: <strong>{centroid.lat.toFixed(6)}</strong></p>
          <p>Longitud: <strong>{centroid.lng.toFixed(6)}</strong></p>
        </div>

        <div>
          <h4 className="font-semibold">Límites (bounds):</h4>
          <p>Norte: <strong>{bounds.north.toFixed(6)}</strong></p>
          <p>Sur: <strong>{bounds.south.toFixed(6)}</strong></p>
          <p>Este: <strong>{bounds.east.toFixed(6)}</strong></p>
          <p>Oeste: <strong>{bounds.west.toFixed(6)}</strong></p>
        </div>
      </div>
    </div>
  );
}
