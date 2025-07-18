import { GeoResponse } from '@/types/coordinatesDto';
import { formatCoordinate } from '@/utils/formatters';
import { useState } from 'react';

interface Props {
  result: GeoResponse;
}

export default function ResultsPanel({ result }: Props) {
  const { centroid, bounds } = result;
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(`${type} copied!`);
        setTimeout(() => setCopySuccess(null), 2000);
      },
      () => {
        setCopySuccess('Error copying');
        setTimeout(() => setCopySuccess(null), 2000);
      }
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Analysis Results
        </h3>
        
        {copySuccess && (
          <div className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-md">
            {copySuccess}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800 dark:text-white">Centroid</h4>
            <button 
              onClick={() => copyToClipboard(`${centroid.lat},${centroid.lng}`, 'Centroid')}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center"
              aria-label="Copy centroid coordinates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">Latitude</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(centroid.lat)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">Longitude</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(centroid.lng)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Bounds</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">North</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(bounds.north)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">South</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(bounds.south)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">East</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(bounds.east)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-gray-500 dark:text-gray-400">West</div>
              <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                {formatCoordinate(bounds.west)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
