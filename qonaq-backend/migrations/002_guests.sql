CREATE TABLE guests (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    personal_greeting TEXT,
    count INTEGER DEFAULT 1,
    side VARCHAR(20) NOT NULL,
    category VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    phone VARCHAR(50),
    email VARCHAR(255),
    token VARCHAR(64) UNIQUE NOT NULL,
    is_vip BOOLEAN DEFAULT FALSE,
    is_elder BOOLEAN DEFAULT FALSE,
    has_children BOOLEAN DEFAULT FALSE,
    assigned_stage_ids TEXT[],
    comment TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    family_group_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_token ON guests(token);
CREATE INDEX idx_guests_status ON guests(status);