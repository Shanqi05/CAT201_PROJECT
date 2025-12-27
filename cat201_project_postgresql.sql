-- PostgreSQL Database Schema for cat201_project
-- For Supabase PostgreSQL Database
-- Generated: Dec 27, 2025

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- --------------------------------------------------------
-- Table structure for table accessories
-- --------------------------------------------------------

CREATE TABLE accessories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2),
  image_path VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dumping data for table accessories
INSERT INTO accessories (id, title, category, price, image_path, status, created_at) VALUES
(1, 'Metal BookMark', 'Bookmark', 11.99, 'images/asrea logo.png', 'Active', '2025-12-26 09:31:55');

-- Reset sequence for accessories
SELECT setval('accessories_id_seq', (SELECT MAX(id) FROM accessories));

-- --------------------------------------------------------
-- Table structure for table users
-- --------------------------------------------------------

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'USER',
  address VARCHAR(255)
);

-- Dumping data for table users
INSERT INTO users (id, username, password, email, role, address) VALUES
(1, 'customer1', 'password123', 'john@example.com', 'user', 'John Address Default'),
(2, 'admin1', 'adminpassword', 'admin@secondbook.com', 'admin', 'Admin Office HQ');

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- --------------------------------------------------------
-- Table structure for table books
-- --------------------------------------------------------

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  listing_type VARCHAR(20) NOT NULL,
  image_path VARCHAR(500),
  seller_id INTEGER,
  category VARCHAR(100),
  book_condition VARCHAR(50),
  rating DECIMAL(3,1) DEFAULT 0.0,
  stock INTEGER DEFAULT 1,
  CONSTRAINT fk_books_seller FOREIGN KEY (seller_id) REFERENCES users (id)
);

-- Create index on seller_id
CREATE INDEX idx_books_seller_id ON books(seller_id);

-- Dumping data for table books
INSERT INTO books (id, title, author, price, status, listing_type, image_path, seller_id, category, book_condition, rating, stock) VALUES
(101, 'The Midnight Library', 'Matt Haig', 14.50, 'Active', '', 'https://via.placeholder.com/200x300?text=Midnight+Library', NULL, 'Fiction', 'Excellent', 4.5, 15),
(102, 'Sapiens: A Brief History', 'Yuval Noah Harari', 18.99, 'Active', '', 'https://via.placeholder.com/200x300?text=Sapiens', NULL, 'Non-Fiction', 'Good', 4.7, 8),
(103, 'Where the Crawdads Sing', 'Delia Owens', 12.99, 'Active', '', 'https://via.placeholder.com/200x300?text=Crawdads', NULL, 'Mystery', 'Very Good', 4.3, 12),
(104, 'Educated: A Memoir', 'Tara Westover', 11.00, 'Active', '', 'https://via.placeholder.com/200x300?text=Educated', NULL, 'Non-Fiction', 'Good', 4.6, 20),
(105, 'The Secret Garden', 'Frances Hodgson Burnett', 7.50, 'Active', '', 'https://via.placeholder.com/200x300?text=Garden', NULL, 'Children', 'Excellent', 4.2, 5);

-- Reset sequence for books
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- --------------------------------------------------------
-- Table structure for table orders
-- --------------------------------------------------------

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create index on user_id
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Dumping data for table orders
INSERT INTO orders (id, user_id, total_amount, status, shipping_address, payment_method, created_at) VALUES
(1, 1, 14.50, 'DELIVERED', '123 Penang Road, Georgetown', 'Credit Card', '2025-12-20 02:00:00'),
(2, 1, 26.49, 'PROCESSING', '123 Penang Road, Georgetown', 'Touch n Go', '2025-12-26 13:22:21');

-- Reset sequence for orders
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

-- --------------------------------------------------------
-- Table structure for table order_items
-- --------------------------------------------------------

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_book FOREIGN KEY (book_id) REFERENCES books (id)
);

-- Create indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_book_id ON order_items(book_id);

-- Dumping data for table order_items
INSERT INTO order_items (id, order_id, book_id, quantity, price_at_purchase) VALUES
(1, 1, 101, 1, 14.50),
(2, 2, 102, 1, 18.99),
(3, 2, 105, 1, 7.50);

-- Reset sequence for order_items
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
