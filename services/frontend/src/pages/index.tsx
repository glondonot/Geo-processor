import { useState } from 'react';
import PointManager from '@/components/PointManager';
import Map from '@/components/MapWrapper';
import ResultsPanel from '@/components/ResultsPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GeoResponse, Point } from '@/types/coordinatesDto';

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [result, setResult] = useState<GeoResponse | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Geospatial Processor</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <PointManager
              onResult={(res) => setResult(res)}
              onPointListUpdate={(list) => setPoints(list)}
            />
            
            {/* Show ResultsPanel if there is a result */}
            {result && (
              <div className="mt-6">
                <ResultsPanel result={result} />
              </div>
            )}
          </div>
          
          <div className="lg:w-1/2">
            <Map points={points} result={result} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}