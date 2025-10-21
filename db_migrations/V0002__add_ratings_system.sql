-- Add ratings table for drivers
CREATE TABLE IF NOT EXISTS t_p41600370_minivan_taxi_app.ratings (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES t_p41600370_minivan_taxi_app.orders(id),
    driver_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add rating column to drivers table
ALTER TABLE t_p41600370_minivan_taxi_app.drivers 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ratings_driver_id ON t_p41600370_minivan_taxi_app.ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_ratings_order_id ON t_p41600370_minivan_taxi_app.ratings(order_id);
