-- Garante que a tabela não será criada se já existir
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    password_hash VARCHAR(255),
    auth_method VARCHAR(50) NOT NULL,
    picture_url TEXT,
    unique_code VARCHAR(10) UNIQUE NOT NULL,
    linked_partner_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
