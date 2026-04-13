package templates

import (
	"time"

	"github.com/lib/pq"
)

type Template struct {
	ID              string          `json:"id"`
	Name            string          `json:"name"`
	Description     string          `json:"description,omitempty"`
	Type            string          `json:"type"`
	TemplateStyle   string          `json:"templateStyle"`
	AccentColor     string          `json:"accentColor"`
	Languages       pq.StringArray  `json:"languages"`
	PreviewImageURL string          `json:"previewImageUrl,omitempty"`
	IsActive        bool            `json:"isActive"`
	SortOrder       int             `json:"sortOrder"`
	Blocks          []TemplateBlock `json:"blocks,omitempty"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
}

type TemplateBlock struct {
	ID         string                 `json:"id"`
	TemplateID string                 `json:"templateId"`
	BlockID    string                 `json:"blockId"`
	Label      string                 `json:"label"`
	Icon       string                 `json:"icon"`
	Enabled    bool                   `json:"enabled"`
	SortOrder  int                    `json:"sortOrder"`
	Settings   map[string]interface{} `json:"settings,omitempty"`
	CreatedAt  time.Time              `json:"createdAt"`
	UpdatedAt  time.Time              `json:"updatedAt"`
}

// Response DTO (frontend-friendly)
type TemplateResponse struct {
	ID              string          `json:"id"`
	Name            string          `json:"name"`
	Description     string          `json:"description"`
	Type            string          `json:"type"`
	TemplateStyle   string          `json:"templateStyle"`
	AccentColor     string          `json:"accentColor"`
	Languages       []string        `json:"languages"`
	PreviewImageURL string          `json:"previewImageUrl"`
	Blocks          []BlockResponse `json:"blocks"`
}

type BlockResponse struct {
	BlockID  string                 `json:"blockId"`
	Label    string                 `json:"label"`
	Icon     string                 `json:"icon"`
	Enabled  bool                   `json:"enabled"`
	Settings map[string]interface{} `json:"settings,omitempty"`
}
