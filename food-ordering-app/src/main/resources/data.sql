-- Insert Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_MANAGER') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (3, 'ROLE_MEMBER') ON DUPLICATE KEY UPDATE name=name;

-- Insert Countries
INSERT INTO countries (id, name) VALUES (1, 'India') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO countries (id, name) VALUES (2, 'America') ON DUPLICATE KEY UPDATE name=name;

-- Insert Users [cite: 4-9]
-- We are now using plain text passwords, which our Java code will hash on startup.
INSERT INTO users (username, password, role_id, country_id) VALUES
    ('nick.fury', 'password123', 1, NULL)
    ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, password, role_id, country_id) VALUES
    ('captain.marvel', 'password123', 2, 1)
    ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, password, role_id, country_id) VALUES
    ('captain.america', 'password123', 2, 2)
    ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, password, role_id, country_id) VALUES
    ('thanos', 'password123', 3, 1)
    ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, password, role_id, country_id) VALUES
    ('thor', 'password123', 3, 1)
    ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, password, role_id, country_id) VALUES
    ('travis', 'password123', 3, 2)
    ON DUPLICATE KEY UPDATE username=username;

-- Insert Restaurants
INSERT INTO restaurants (id, name, cuisine, address, phone_number, country_id, is_active, image_url) VALUES
    (1, 'Taj Mahal Restaurant', 'Indian', '123 Main Street, Mumbai', '+91-1234567890', 1, TRUE, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO restaurants (id, name, cuisine, address, phone_number, country_id, is_active, image_url) VALUES
    (2, 'Spice Garden', 'Indian', '456 Park Avenue, Delhi', '+91-9876543210', 1, TRUE, 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO restaurants (id, name, cuisine, address, phone_number, country_id, is_active, image_url) VALUES
    (3, 'Burger Palace', 'American', '789 Broadway, New York', '+1-555-123-4567', 2, TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO restaurants (id, name, cuisine, address, phone_number, country_id, is_active, image_url) VALUES
    (4, 'Pizza Corner', 'Italian-American', '321 5th Avenue, Los Angeles', '+1-555-987-6543', 2, TRUE, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

-- Insert Menu Items for Taj Mahal Restaurant (India)
INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (1, 'Butter Chicken', 'Creamy tomato-based curry with tender chicken', 450.00, 'MAIN_COURSE', 1, TRUE, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (2, 'Biryani', 'Fragrant basmati rice with spiced meat', 350.00, 'MAIN_COURSE', 1, TRUE, 'https://images.unsplash.com/photo-1585937421841-c17d100e59f0?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (3, 'Samosas', 'Crispy fried pastries with spiced potato filling', 80.00, 'APPETIZER', 1, TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (4, 'Mango Lassi', 'Sweet yogurt drink with mango', 120.00, 'BEVERAGE', 1, TRUE, 'https://images.unsplash.com/photo-1505252585461-04db1267ae5b?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

-- Insert Menu Items for Spice Garden (India)
INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (5, 'Paneer Tikka', 'Grilled cottage cheese with spices', 280.00, 'APPETIZER', 2, TRUE, 'https://images.unsplash.com/photo-1599599810694-f3ee3b6820b2?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (6, 'Dal Makhani', 'Creamy black lentils', 220.00, 'MAIN_COURSE', 2, TRUE, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (7, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 150.00, 'DESSERT', 2, TRUE, 'https://images.unsplash.com/photo-1585080872051-9bea27dc8df5?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

-- Insert Menu Items for Burger Palace (America)
INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (8, 'Classic Cheeseburger', 'Beef patty with cheese, lettuce, tomato', 12.99, 'MAIN_COURSE', 3, TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (9, 'French Fries', 'Crispy golden fries', 4.99, 'APPETIZER', 3, TRUE, 'https://images.unsplash.com/photo-1585238341710-4b6c6649eafb?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (10, 'Chocolate Shake', 'Rich chocolate milkshake', 5.99, 'BEVERAGE', 3, TRUE, 'https://images.unsplash.com/photo-1578042360383-25ea54eec2a7?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

-- Insert Menu Items for Pizza Corner (America)
INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (11, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, basil', 14.99, 'MAIN_COURSE', 4, TRUE, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (12, 'Pepperoni Pizza', 'Pizza with pepperoni and cheese', 16.99, 'MAIN_COURSE', 4, TRUE, 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (13, 'Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 8.99, 'APPETIZER', 4, TRUE, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;

INSERT INTO menu_items (id, name, description, price, category, restaurant_id, is_available, image_url) VALUES
    (14, 'Tiramisu', 'Classic Italian dessert', 7.99, 'DESSERT', 4, TRUE, 'https://images.unsplash.com/photo-1571115764595-644a40f36b5d?w=400&h=300&fit=crop')
    ON DUPLICATE KEY UPDATE name=name;