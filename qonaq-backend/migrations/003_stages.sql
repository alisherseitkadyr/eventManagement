CREATE TABLE stages (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name_ru VARCHAR(255) NOT NULL,
    name_kz VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    place VARCHAR(255) NOT NULL,
    address TEXT,
    map_url TEXT,
    description_ru TEXT,
    description_kz TEXT,
    emoji VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stages_event_id ON stages(event_id);