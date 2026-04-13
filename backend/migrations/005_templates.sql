-- Templates table for reusable event presets
CREATE TABLE templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    template_style VARCHAR(50) NOT NULL DEFAULT 'elegant',
    accent_color VARCHAR(20) DEFAULT '#7A2E3A',
    languages TEXT[] DEFAULT '{ru,kz}',
    preview_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template-specific default blocks (overrides global defaults)
CREATE TABLE template_blocks (
    id VARCHAR(36) PRIMARY KEY,
    template_id VARCHAR(36) NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    block_id VARCHAR(50) NOT NULL,  -- e.g., 'cover', 'countdown', 'rsvp'
    label VARCHAR(100),
    icon VARCHAR(10),
    enabled BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    settings JSONB,                -- extra config (e.g., countdown style)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, block_id)
);

CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_templates_active ON templates(is_active);