import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Vehicle {
  id: string;
  model: string;
  image: string;
  seats: number;
  luggage: number;
  price: number;
  features: string[];
}

const vehicles: Vehicle[] = [
  {
    id: '1',
    model: 'Kia Carnival',
    image: '/placeholder.svg',
    seats: 7,
    luggage: 4,
    price: 45000,
    features: ['Кондиционер', 'Wi-Fi', 'USB-зарядка', 'Панорамная крыша']
  },
  {
    id: '2',
    model: 'Hyundai Staria',
    image: '/placeholder.svg',
    seats: 9,
    luggage: 5,
    price: 55000,
    features: ['Premium салон', 'Климат-контроль', 'Массажные кресла', 'Холодильник']
  },
  {
    id: '3',
    model: 'Hyundai H1',
    image: '/placeholder.svg',
    seats: 8,
    luggage: 6,
    price: 40000,
    features: ['Кондиционер', 'Большой багажник', 'USB-зарядка', 'Аудиосистема']
  }
];

type TripType = 'city' | 'airport' | 'intercity' | 'hourly';

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'route' | 'vehicle' | 'payment'>('route');
  const [tripType, setTripType] = useState<TripType>('city');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showMap, setShowMap] = useState(false);

  const tripTypes = [
    { id: 'city' as TripType, label: 'Городской', icon: 'Car' },
    { id: 'airport' as TripType, label: 'Аэропорт', icon: 'Plane' },
    { id: 'intercity' as TripType, label: 'Межгород', icon: 'MapPin' },
    { id: 'hourly' as TripType, label: 'Почасовая', icon: 'Clock' }
  ];

  const paymentMethods = [
    { id: 'payme', name: 'Payme', icon: 'CreditCard' },
    { id: 'click', name: 'Click', icon: 'Smartphone' },
    { id: 'uzum', name: 'Uzum', icon: 'Wallet' },
    { id: 'cash', name: 'Наличные', icon: 'Banknote' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center">
              <Icon name="Car" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VanRide</h1>
              <p className="text-xs text-gray-500">Премиум минивэны</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/driver')}>
              <Icon name="Car" size={18} className="mr-2" />
              Водитель
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {['route', 'vehicle', 'payment'].map((s, index) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step === s ? 'bg-primary text-white scale-110' : 
                ['route', 'vehicle'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {['route', 'vehicle'].indexOf(step) > index ? <Icon name="Check" size={16} /> : index + 1}
              </div>
              {index < 2 && <div className={`w-12 h-1 mx-1 transition-all ${
                ['route', 'vehicle'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
              }`} />}
            </div>
          ))}
        </div>

        {step === 'route' && (
          <div className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Куда едем?</h2>
              <p className="text-gray-600 mb-8 text-center">Выберите тип поездки и маршрут</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {tripTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      tripType === type.id 
                        ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:scale-105'
                    }`}
                  >
                    <Icon name={type.icon as any} size={28} className={tripType === type.id ? 'text-primary mb-2' : 'text-gray-400 mb-2'} />
                    <p className={`text-sm font-semibold ${tripType === type.id ? 'text-primary' : 'text-gray-700'}`}>
                      {type.label}
                    </p>
                  </button>
                ))}
              </div>

              <Card className="p-6 mb-6 shadow-lg border-0">
                <div className="space-y-4">
                  <div className="relative">
                    <Icon name="MapPin" className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    <Input
                      placeholder="Откуда"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pl-11 h-14 text-lg border-gray-300 focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    <Icon name="Navigation" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <Input
                      placeholder="Куда"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="pl-11 h-14 text-lg border-gray-300 focus:border-primary"
                    />
                  </div>
                </div>
              </Card>

              <Card className="h-64 mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg overflow-hidden relative">
                {!showMap ? (
                  <button 
                    onClick={() => setShowMap(true)}
                    className="w-full h-full flex items-center justify-center hover:bg-blue-200/50 transition-colors"
                  >
                    <div className="text-center">
                      <Icon name="Map" size={48} className="text-primary mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Показать карту маршрута</p>
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-48 h-48 mx-auto mb-4">
                          <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full opacity-50 animate-ping" />
                          <Icon name="MapPin" size={20} className="absolute top-3 left-3 text-green-600" />
                          
                          <Icon name="Navigation" size={20} className="absolute bottom-3 right-3 text-primary" />
                          <div className="absolute bottom-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
                          
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            <path
                              d="M 20 20 Q 50 50, 80 80"
                              stroke="#0EA5E9"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray="4 4"
                              className="animate-pulse"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">~15 км • ~25 минут</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <Button 
                onClick={() => setStep('vehicle')} 
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={!from || !to}
              >
                Выбрать автомобиль
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'vehicle' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => setStep('route')}>
                  <Icon name="ArrowLeft" size={20} className="mr-2" />
                  Назад
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">Выберите минивэн</h2>
                <div className="w-20" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {vehicles.map(vehicle => (
                  <Card
                    key={vehicle.id}
                    className={`overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedVehicle?.id === vehicle.id 
                        ? 'ring-4 ring-primary shadow-2xl scale-105' 
                        : 'hover:shadow-xl hover:scale-105'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                      <Icon name="Car" size={64} className="text-gray-400" />
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                          <Icon name="Check" size={18} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{vehicle.model}</h3>
                      
                      <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Icon name="Users" size={18} />
                          <span className="text-sm">{vehicle.seats} мест</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Icon name="Luggage" size={18} />
                          <span className="text-sm">{vehicle.luggage} чемоданов</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {vehicle.features.slice(0, 2).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">от</p>
                          <p className="text-2xl font-bold text-primary">{vehicle.price.toLocaleString()} сум</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button 
                onClick={() => setStep('payment')} 
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={!selectedVehicle}
              >
                Продолжить к оплате
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && selectedVehicle && (
          <div className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => setStep('vehicle')}>
                  <Icon name="ArrowLeft" size={20} className="mr-2" />
                  Назад
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">Оплата</h2>
                <div className="w-20" />
              </div>

              <Card className="p-6 mb-6 shadow-lg border-0">
                <h3 className="font-semibold text-lg mb-4">Детали заказа</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Маршрут:</span>
                    <span className="font-medium">{from} → {to}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Автомобиль:</span>
                    <span className="font-medium">{selectedVehicle.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Тип поездки:</span>
                    <span className="font-medium">{tripTypes.find(t => t.id === tripType)?.label}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Итого:</span>
                    <span className="font-bold text-2xl text-primary">{selectedVehicle.price.toLocaleString()} сум</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6 shadow-lg border-0">
                <h3 className="font-semibold text-lg mb-4">Способ оплаты</h3>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3 hover:scale-105 duration-200"
                    >
                      <Icon name={method.icon as any} size={24} className="text-gray-600" />
                      <span className="font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Button className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-green-500 hover:bg-green-600">
                <Icon name="Check" size={20} className="mr-2" />
                Подтвердить заказ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;