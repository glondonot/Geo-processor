import { Point } from '@/types/coordinatesDto';
import { formatCoordinate } from '@/utils/formatters';

interface Props {
  points: Point[];
  onDelete: (index: number) => void;
}

export default function CoordinateTable({ points, onDelete }: Props) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Entered Points</h3>
        <span className={`text-sm ${points.length === 1 ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          {points.length} {points.length === 1 ? 'point (min. 2)' : 'points'}
        </span>
      </div>
      
      <div className="border dark:border-gray-700 rounded-md overflow-hidden">
        <div className="max-h-60 overflow-y-auto scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Latitude
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Longitude
                </th>
                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {points.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatCoordinate(p.lat)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatCoordinate(p.lng)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                    <button
                      onClick={() => onDelete(i)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      aria-label={`Delete point ${i+1}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}