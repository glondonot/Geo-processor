import { GeoResponse, Point } from '@/types/coordinatesDto';
import { useState } from 'react';

interface Props {
  points: Point[];
  result: GeoResponse | null;
}

export default function ExportButtons({ points, result }: Props) {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const exportToJSON = () => {
    if (!result) return;

    const exportData = {
      points,
      result
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geo-processor-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess('JSON');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const exportToCSV = () => {
    if (points.length === 0) return;

    // Create header
    let csvContent = "index,latitude,longitude\n";
    
    // Add points
    points.forEach((point, index) => {
      csvContent += `${index + 1},${point.lat},${point.lng}\n`;
    });

    // Add centroid if result exists
    if (result) {
      csvContent += "\ncentroid,latitude,longitude\n";
      csvContent += `centroid,${result.centroid.lat},${result.centroid.lng}\n`;
      
      csvContent += "\nbounds,value\n";
      csvContent += `north,${result.bounds.north}\n`;
      csvContent += `south,${result.bounds.south}\n`;
      csvContent += `east,${result.bounds.east}\n`;
      csvContent += `west,${result.bounds.west}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geo-processor-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess('CSV');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  if (!result) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={exportToJSON}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          disabled={!result}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export JSON
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          disabled={!result}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export CSV
        </button>
      </div>
      
      {exportSuccess && (
        <div className="mt-2 text-sm font-medium px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-md inline-block">
          {exportSuccess} exported successfully!
        </div>
      )}
    </div>
  );
}
