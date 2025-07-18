import Head from 'next/head';
import { useState } from 'react';
import PointForm from '@/components/PointForm';
import { GeoResponse } from '@/types/coordinatesDto';
import ResultsPanel from '@/components/ResultsPanel';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [geoResult, setGeoResult] = useState<GeoResponse | null>(null);

  return (
    <>
      <Head>
        <title>GeoProcessor</title>
        <meta name="description" content="Calculadora de centroide y límites geográficos" />
      </Head>

      <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">🌍 GeoProcessor</h1>

        <PointForm onResult={setGeoResult} />

        {geoResult && (
          <>
            <div className="w-full max-w-4xl mt-6">
              <ResultsPanel result={geoResult} />
            </div>

            <div className="w-full max-w-4xl mt-6 h-[400px]">
              <Map result={geoResult} />
            </div>
          </>
        )}
      </main>
    </>
  );
}