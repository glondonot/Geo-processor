import { useState } from 'react';
import PointForm from './PointForm';
import CoordinateTable from './CoordinateTable';
import ExportButtons from './ExportButtons';
import { Point, GeoResponse } from '@/types/coordinatesDto';
import { processPoints } from '@/services/api';

interface Props {
  onResult: (data: GeoResponse | null) => void;
  onPointListUpdate: (points: Point[]) => void;
}

export default function PointManager({ onResult, onPointListUpdate }: Props) {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeoResponse | null>(null);

  const updatePoints = (newPoints: Point[]) => {
    setPoints(newPoints);
    onPointListUpdate(newPoints);
    
    // Reset result if points are cleared
    if (newPoints.length === 0 && result) {
      setResult(null);
      onResult(null);
    }
  };

  const handleAddPoint = (point: Point) => {
    const parsedPoint = {
      lat: parseFloat(point.lat as unknown as string),
      lng: parseFloat(point.lng as unknown as string),
    };
    const updated = [...points, parsedPoint];
    updatePoints(updated);
    
    if (error) setError(null);
  };

  const handleDeletePoint = (index: number) => {
    const updated = points.filter((_, i) => i !== index);
    updatePoints(updated);
    
    // Reset result if last point is removed
    if (updated.length === 0) {
      setResult(null);
      onResult(null);
    }
  };

  const handleReset = () => {
    updatePoints([]);
    setError(null);
    setResult(null);
    onResult(null);
  };

  const handleSubmit = async () => {
    // Verify there are at least 2 points before processing
    if (points.length < 2) {
      setError("At least 2 points are required for processing.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await processPoints(points);
      setResult(response);
      onResult(response);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
            err !== null &&
            'response' in err &&
            (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'Error processing points.';
      setError(errorMessage ?? 'Unknown error.');
      setResult(null);
      onResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Enter Coordinates
        </h2>
        
        {points.length > 0 && (
          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
            {points.length} {points.length === 1 ? 'point' : 'points'}
          </span>
        )}
      </div>

      <PointForm onAddPoint={handleAddPoint} />

      {points.length > 0 && (
        <>
          <CoordinateTable points={points} onDelete={handleDeletePoint} />
          
          {points.length === 1 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                You need to add at least one more point to process.
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || points.length < 2}
              className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              title={points.length < 2 ? "At least 2 points are required for processing" : "Process points"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Process Points
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Clear
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {result && <ExportButtons points={points} result={result} />}
    </div>
  );
}