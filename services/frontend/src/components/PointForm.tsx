import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormValues = {
  lat: number;
  lng: number;
};

interface Props {
  onAddPoint: (point: FormValues) => void;
}

export default function PointForm({ onAddPoint }: Props) {
  const [isRandom, setIsRandom] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    onAddPoint({ lat: data.lat, lng: data.lng });
    reset();
  };
  
  const generateRandomCoordinates = () => {
    setIsRandom(true);
    // Generate random coordinates within valid ranges
    const randomLat = parseFloat((Math.random() * 180 - 90).toFixed(6));
    const randomLng = parseFloat((Math.random() * 360 - 180).toFixed(6));
    
    setValue('lat', randomLat);
    setValue('lng', randomLng);
    
    // Reset the random state after a short delay
    setTimeout(() => setIsRandom(false), 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="lat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Latitude
          </label>
          <input
            id="lat"
            type="number"
            step="any"
            placeholder="-90 to 90"
            {...register('lat', { required: true, min: -90, max: 90 })}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {errors.lat && (
            <span className="text-red-500 text-sm">Latitude must be between -90 and 90</span>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="lng" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Longitude
          </label>
          <input
            id="lng"
            type="number"
            step="any"
            placeholder="-180 to 180"
            {...register('lng', { required: true, min: -180, max: 180 })}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {errors.lng && (
            <span className="text-red-500 text-sm">Longitude must be between -180 and 180</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                    transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add Point
        </button>
        
        <button
          type="button"
          onClick={generateRandomCoordinates}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md 
                   hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
          </svg>
          {isRandom ? "Generating..." : "Random Coordinates"}
        </button>
      </div>
    </form>
  );
}