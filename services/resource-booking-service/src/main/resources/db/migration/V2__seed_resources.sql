ALTER TABLE resource ADD CONSTRAINT unique_resource_name UNIQUE (name);

INSERT INTO resource_type (name) VALUES
    ('Study Room'),
    ('Lab'),
    ('Auditorium')
ON CONFLICT (name) DO NOTHING;

WITH rt AS (
    SELECT id, name FROM resource_type
)
INSERT INTO resource (type_id, parent_id, name, capacity)
VALUES
    ((SELECT id FROM rt WHERE name = 'Study Room'), NULL, 'Study Room A', 2),
    ((SELECT id FROM rt WHERE name = 'Study Room'), NULL, 'Study Room B', 3),
    ((SELECT id FROM rt WHERE name = 'Lab'), NULL, 'Computer Lab 1', 20),
    ((SELECT id FROM rt WHERE name = 'Auditorium'), NULL, 'Main Auditorium', 100)
ON CONFLICT (name) DO NOTHING;

