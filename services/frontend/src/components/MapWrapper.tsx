'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Point, GeoResponse } from '@/types/coordinatesDto';

// Will load the map only on the client
const DynamicMap = dynamic(
  () => import('@/components/MapClient').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading map...
        </div>
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
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
          </svg>
          Map Visualization
        </h2>
        
        {points.length > 0 && (
          <div className="text-sm">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              {points.length} {points.length === 1 ? 'location' : 'locations'}
            </span>
            {result && (
              <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                Processed
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <DynamicMap points={points} result={result} />
      </div>
      
      {points.length === 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Add points using the form to visualize them on the map
          </p>
        </div>
      )}
    </div>
  );
}
