CREATE TABLE resource_type (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE resource (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_id BIGINT NOT NULL,
    parent_id BIGINT NULL,
    name VARCHAR(200) NOT NULL,
    capacity INT NULL,
    CONSTRAINT fk_rt FOREIGN KEY (type_id) REFERENCES resource_type (id),
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES resource (id)
);

CREATE TABLE booking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    resource_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id) REFERENCES resource (id)
);

CREATE INDEX idx_booking_time ON booking (resource_id, start_time, end_time);

