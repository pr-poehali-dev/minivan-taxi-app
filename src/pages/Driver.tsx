import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  order_number: string;
  from_location: string;
  to_location: string;
  trip_type: string;
  vehicle_model: string;
  price: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}

const Driver = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'active' | 'history'>('new');
  const [orders, setOrders] = useState<Order[]>([]);

  const mockOrders: Order[] = [
    {
      id: 1,
      order_number: 'VR-20251021-001',
      from_location: 'Аэропорт Ташкента',
      to_location: 'Отель Hyatt Regency',
      trip_type: 'airport',
      vehicle_model: 'Kia Carnival',
      price: 45000,
      status: 'new',
      customer_name: 'Алексей Петров',
      customer_phone: '+998901234567',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      order_number: 'VR-20251021-002',
      from_location: 'Ул. Мустакиллик 1',
      to_location: 'ТРЦ Магик Сити',
      trip_type: 'city',
      vehicle_model: 'Hyundai Staria',
      price: 55000,
      status: 'active',
      customer_name: 'Наталья Иванова',
      customer_phone: '+998901234568',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700 border-blue-300',
      active: 'bg-green-100 text-green-700 border-green-300',
      completed: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    const labels = {
      new: 'Новый',
      active: 'В работе',
      completed: 'Завершён'
    };
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] };
  };

  const getTripTypeLabel = (type: string) => {
    const types = {
      city: 'Городской',
      airport: 'Аэропорт',
      intercity: 'Межгород',
      hourly: 'Почасовая'
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'new') return order.status === 'new';
    if (activeTab === 'active') return order.status === 'active';
    return order.status === 'completed';
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-white text-lg">АК</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Азиз Каримов</h1>
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">4.95 • 342 поездки</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Новые заказы</p>
                <p className="text-3xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'new').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Icon name="Bell" size={24} className="text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Активные</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Car" size={24} className="text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Заработок сегодня</p>
                <p className="text-3xl font-bold text-purple-600">185K</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Icon name="Wallet" size={24} className="text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'new'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Новые ({orders.filter(o => o.status === 'new').length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Активные ({orders.filter(o => o.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            История
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-md">
              <Icon name="InboxIcon" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Нет заказов</p>
            </Card>
          ) : (
            filteredOrders.map(order => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <Card key={order.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">№ {order.order_number}</h3>
                          <Badge className={`${statusBadge.style} border`}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{getTripTypeLabel(order.trip_type)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{order.price.toLocaleString()} сум</p>
                        <p className="text-xs text-gray-500">{order.vehicle_model}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <Icon name="MapPin" size={20} className="text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Откуда</p>
                          <p className="font-medium text-gray-900">{order.from_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Navigation" size={20} className="text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Куда</p>
                          <p className="font-medium text-gray-900">{order.to_location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="User" size={20} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'new' && (
                        <>
                          <Button className="flex-1 bg-green-500 hover:bg-green-600">
                            <Icon name="Check" size={18} className="mr-2" />
                            Принять
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Icon name="X" size={18} className="mr-2" />
                            Отклонить
                          </Button>
                        </>
                      )}
                      {order.status === 'active' && (
                        <>
                          <Button className="flex-1">
                            <Icon name="Navigation" size={18} className="mr-2" />
                            Навигация
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Icon name="Phone" size={18} className="mr-2" />
                            Позвонить
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full shadow-2xl h-14 px-6">
          <Icon name="Power" size={20} className="mr-2" />
          Я на линии
        </Button>
      </div>
    </div>
  );
};

export default Driver;
