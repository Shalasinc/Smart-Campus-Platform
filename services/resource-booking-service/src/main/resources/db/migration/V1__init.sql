CREATE TABLE resource_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE resource (
    id BIGSERIAL PRIMARY KEY,
    type_id BIGINT NOT NULL REFERENCES resource_type (id),
    parent_id BIGINT NULL REFERENCES resource (id),
    name VARCHAR(200) NOT NULL,
    capacity INT NULL
);

CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL REFERENCES resource (id),
    user_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE INDEX idx_booking_time ON booking (resource_id, start_time, end_time);

INSERT INTO resource_type (name) VALUES
('Classroom'),
('Laboratory'),
('Meeting Room');

INSERT INTO resource (type_id, parent_id, name, capacity) VALUES
((SELECT id FROM resource_type WHERE name = 'Classroom'), NULL, 'Room A101', 20),
((SELECT id FROM resource_type WHERE name = 'Laboratory'), NULL, 'Lab B201', 15),
((SELECT id FROM resource_type WHERE name = 'Meeting Room'), NULL, 'Meeting C301', 8);

