CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    create_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- room participant Schema
CREATE TABLE room_participants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
)
-- Room Schema is here
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    created_by INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
)
ALTER TABLE rooms ADD COLUMN room_type VARCHAR(50) DEFAULT 'public';

-- Message Schema
CREATE TABLE message(
 id SERIAL PRIMARY KEY,
 room_id INTEGER NOT NULL REFERENCES rooms(id),
 sender_id INTEGER NOT NULL REFERENCES users(id),
 content TEXT NOT NULL,
 send_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)