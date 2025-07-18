'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Rectangle, Tooltip, useMap, Circle, ZoomControl } from 'react-leaflet';
import { LatLngBoundsExpression, LatLngTuple, Icon } from 'leaflet';
import { Point, GeoResponse } from '@/types/coordinatesDto';
import 'leaflet/dist/leaflet.css';

interface Props {
  points: Point[];
  result: GeoResponse | null;
}

// Component to adjust the map to points or bounding box
function FitBounds({ points, bounds }: { points: Point[]; bounds?: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length > 0) {
      const latlngs = points.map((p) => [p.lat, p.lng] as LatLngTuple);
      
      if (points.length === 1) {
        map.setView(latlngs[0], 10);
      } else {
        map.fitBounds(latlngs as unknown as LatLngBoundsExpression, { padding: [50, 50] });
      }
    }
  }, [points, bounds, map]);

  return null;
}

export default function MapClient({ points, result }: Props) {
  // Default center point for the map
  const DEFAULT_CENTER: LatLngTuple = [0, 0];
  const DEFAULT_ZOOM = 2;

  // Define bounds if result exists
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

  // Create custom icons for markers
  const redIcon = useMemo(() => new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }), []);
  
  const blueIcon = useMemo(() => new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }), []);

  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded overflow-hidden">
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          className="satellite-layer"
        />
        
        <ZoomControl position="bottomright" />
        <FitBounds points={points} bounds={bounds} />
        
        {/* Input points */}
        {points.map((point, i) => (
          <Marker 
            key={`point-${i}`} 
            position={[point.lat, point.lng]}
            icon={blueIcon}
          >
            <Tooltip permanent direction="top" offset={[0, -25]}>
              <span className="font-semibold">Point {i + 1}</span>
            </Tooltip>
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
              <Tooltip permanent direction="top" offset={[0, -25]}>
              <span className="font-semibold">Centroid</span>
              <div className="text-xs mt-1">
                ({result.centroid.lat.toFixed(6)}, {result.centroid.lng.toFixed(6)})
              </div>
            </Tooltip>
            </Marker>
            
            {/* Circle around the centroid */}
            <Circle 
              center={[result.centroid.lat, result.centroid.lng]} 
              radius={500}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2, weight: 2 }}
            />
            
            {/* Bounding Box */}
            <Rectangle
              bounds={bounds!}
              pathOptions={{ color: 'red', weight: 3, fillOpacity: 0.05, dashArray: '5, 5' }}
            >
              <Tooltip sticky>
                <div className="font-semibold">Bounded Area</div>
                <div className="text-xs mt-1">
                  N: {result.bounds.north.toFixed(6)}, S: {result.bounds.south.toFixed(6)}<br/>
                  E: {result.bounds.east.toFixed(6)}, W: {result.bounds.west.toFixed(6)}
                </div>
              </Tooltip>
            </Rectangle>
          </>
        )}
      </MapContainer>
    </div>
  );
}
