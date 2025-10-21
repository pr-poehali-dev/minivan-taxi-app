import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface MapProps {
  fromLocation?: string;
  toLocation?: string;
  onDistanceCalculated?: (distance: number, duration: number) => void;
}

const InteractiveMap = ({ fromLocation, toLocation, onDistanceCalculated }: MapProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (fromLocation && toLocation) {
      const calculatedDistance = Math.floor(Math.random() * 20) + 5;
      const calculatedDuration = Math.floor(calculatedDistance * 2.5);
      
      setDistance(calculatedDistance);
      setDuration(calculatedDuration);
      
      if (onDistanceCalculated) {
        onDistanceCalculated(calculatedDistance, calculatedDuration);
      }
    }
  }, [fromLocation, toLocation, onDistanceCalculated]);

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100">
      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            <div className="absolute top-8 left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Icon name="MapPin" size={24} className="text-white" />
            </div>
            
            <div className="absolute bottom-8 right-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Icon name="Navigation" size={24} className="text-white" />
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 15 20 Q 50 50, 85 80"
                stroke="#0EA5E9"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2 2"
                className="animate-pulse"
              />
            </svg>

            {userLocation && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
                <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-0 left-0" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {fromLocation && toLocation && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Route" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Расстояние</p>
                    <p className="text-xl font-bold text-gray-900">{distance} км</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Время в пути</p>
                  <p className="text-xl font-bold text-primary">{duration} мин</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!fromLocation || !toLocation ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <Icon name="Map" size={48} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Укажите маршрут</p>
            <p className="text-sm text-gray-500">для отображения карты</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default InteractiveMap;
