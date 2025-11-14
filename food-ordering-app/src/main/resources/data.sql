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