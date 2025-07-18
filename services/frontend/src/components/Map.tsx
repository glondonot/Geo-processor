'use client';

import dynamic from 'next/dynamic';
import { Point, GeoResponse } from '@/types/coordinatesDto';

// Dynamically import the map component to avoid SSR errors
const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded shadow-md">
        <div className="text-gray-500">Loading map...</div>
      </div>
    ),
  }
);

interface Props {
  points: Point[];
  result: GeoResponse | null;
}

export default function Map({ points, result }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Map Visualization</h2>
      <MapWithNoSSR points={points} result={result} />
    </div>
  );
}
