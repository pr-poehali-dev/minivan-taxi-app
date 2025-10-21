-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    seats INTEGER NOT NULL,
    luggage INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    features TEXT[] NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    trip_type VARCHAR(50) NOT NULL,
    vehicle_id INTEGER REFERENCES vehicles(id),
    vehicle_model VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    driver_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    vehicle_id INTEGER REFERENCES vehicles(id),
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample vehicles
INSERT INTO vehicles (model, seats, luggage, base_price, features) VALUES
('Kia Carnival', 7, 4, 45000, ARRAY['Кондиционер', 'Wi-Fi', 'USB-зарядка', 'Панорамная крыша']),
('Hyundai Staria', 9, 5, 55000, ARRAY['Premium салон', 'Климат-контроль', 'Массажные кресла', 'Холодильник']),
('Hyundai H1', 8, 6, 40000, ARRAY['Кондиционер', 'Большой багажник', 'USB-зарядка', 'Аудиосистема'])
ON CONFLICT DO NOTHING;

-- Insert sample drivers
INSERT INTO drivers (name, phone, vehicle_id, rating, total_trips) VALUES
('Азиз Каримов', '+998901234567', 1, 4.95, 342),
('Фарход Усманов', '+998901234568', 2, 4.88, 287),
('Шахзод Алиев', '+998901234569', 3, 4.92, 419)
ON CONFLICT DO NOTHING;