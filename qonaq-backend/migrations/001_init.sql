-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    template_style VARCHAR(50) NOT NULL DEFAULT 'elegant',
    languages TEXT[] DEFAULT '{ru,kz}',
    accent_color VARCHAR(20) DEFAULT '#7A2E3A',
    title_ru VARCHAR(255) NOT NULL,
    title_kz VARCHAR(255) NOT NULL,
    subtitle_ru TEXT,
    subtitle_kz TEXT,
    description_ru TEXT,
    description_kz TEXT,
    cover_image_url TEXT,
    dress_code_ru TEXT,
    dress_code_kz TEXT,
    gift_wishes_ru TEXT,
    gift_wishes_kz TEXT,
    coordinator_name VARCHAR(255),
    coordinator_phone VARCHAR(50),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_published ON events(published);