import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import { GeoResponse } from '@/types/coordinatesDto';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
  result: GeoResponse;
}

function FitBounds({ result }: { result: GeoResponse }) {
  const map = useMap();
  const bounds: [number, number][] = [
    [result.bounds.south, result.bounds.west],
    [result.bounds.north, result.bounds.east]
  ];
  map.fitBounds(bounds);
  return null;
}

// Icono personalizado (opcional)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ result }: Props) {
  const bounds: [[number, number], [number, number]] = [
    [result.bounds.south, result.bounds.west],
    [result.bounds.north, result.bounds.east]
  ];

  return (
    <MapContainer center={[result.centroid.lat, result.centroid.lng]} zoom={4} scrollWheelZoom={false} className="h-full w-full rounded-md shadow">
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[result.centroid.lat, result.centroid.lng]} icon={markerIcon}>
        <Popup>Centroide</Popup>
      </Marker>

      <Rectangle bounds={bounds} pathOptions={{ color: 'blue', weight: 2 }} />

      <FitBounds result={result} />
    </MapContainer>
  );
}
