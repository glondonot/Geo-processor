'use client';

import { MapContainer, TileLayer, Marker, Rectangle, Tooltip, useMap, Circle } from 'react-leaflet';
import { LatLngBoundsExpression, LatLngTuple, Icon } from 'leaflet';
import { Point, GeoResponse } from '@/types/coordinatesDto';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

interface Props {
  points: Point[];
  result: GeoResponse | null;
}

// Adjust the map view to points or bounding box
function FitBounds({ points, bounds }: { points: Point[]; bounds?: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    } else if (points.length > 0) {
      const latlngs = points.map((p) => [p.lat, p.lng] as LatLngTuple);
      
      if (points.length === 1) {
        map.setView(latlngs[0], 10);
      } else {
        map.fitBounds(latlngs as unknown as LatLngBoundsExpression, { padding: [30, 30] });
      }
    }
  }, [points, bounds, map]);

  return null;
}

function MapComponentInner({ points, result }: Props) {
  const DEFAULT_CENTER: LatLngTuple = [0, 0];
  const DEFAULT_ZOOM = 2;

  const bounds: LatLngBoundsExpression | undefined = result
    ? [
        [result.bounds.south, result.bounds.west],
        [result.bounds.north, result.bounds.east],
      ]
    : undefined;

  // Fix Leaflet icon problem
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // @ts-expect-error - Known issue with Leaflet icons in Next.js
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const redIcon = useMemo(() => new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }), []);

  return (
    <div className="w-full h-[500px] rounded shadow-md overflow-hidden">
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds points={points} bounds={bounds} />
        
        {/* Input points */}
        {points.map((point, i) => (
          <Marker key={`point-${i}`} position={[point.lat, point.lng]}>
            <Tooltip permanent>Point {i + 1}</Tooltip>
          </Marker>
        ))}
        
        {/* Results */}
        {result && (
          <>
            {/* Centroid */}
            <Marker 
              position={[result.centroid.lat, result.centroid.lng]} 
              icon={redIcon}
            >
              <Tooltip permanent>Centroid</Tooltip>
            </Marker>
            
            {/* Circle around the centroid */}
            <Circle 
              center={[result.centroid.lat, result.centroid.lng]} 
              radius={500}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
            />
            
            {/* Bounding Box */}
            <Rectangle
              bounds={bounds!}
              pathOptions={{ color: 'red', weight: 2, fillOpacity: 0.1 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

// Export the component
const MapComponent = MapComponentInner;
export default MapComponent;
