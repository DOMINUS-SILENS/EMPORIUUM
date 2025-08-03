-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    vendeur_id INTEGER REFERENCES users(id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id)
);

-- Insert sample users
INSERT INTO users (name, email, role, password) VALUES
('Admin', 'admin@example.com', 'admin', 'hashedpassword'),
('Vendeur', 'vendeur@example.com', 'vendeur', 'hashedpassword'),
('Acheteur', 'acheteur@example.com', 'acheteur', 'hashedpassword')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, price, vendeur_id) VALUES
('Produit A', 10.00, 2),
('Produit B', 20.00, 2)
ON CONFLICT DO NOTHING;

-- Insert sample purchase
INSERT INTO purchases (user_id, product_id) VALUES (3, 1)
ON CONFLICT DO NOTHING; 