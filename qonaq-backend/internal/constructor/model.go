package constructor

import (
	"time"

	"event/internal/shared/utils"
	"gorm.io/gorm"
)

type ConstructorSettings struct {
	ID        string     `gorm:"primaryKey;size:36" json:"id"`
	EventID   string     `gorm:"size:36;not null;uniqueIndex" json:"eventId"`
	Blocks    JSONBlocks `gorm:"type:jsonb;not null;default:'[]'" json:"blocks"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

type JSONBlocks []ConstructorBlock

type ConstructorBlock struct {
	ID      string `json:"id"`
	Label   string `json:"label"`
	Icon    string `json:"icon"`
	Enabled bool   `json:"enabled"`
}

func (c *ConstructorSettings) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = utils.GenerateShortID("cs")
	}
	c.CreatedAt = time.Now().UTC()
	c.UpdatedAt = time.Now().UTC()
	return nil
}

func (c *ConstructorSettings) BeforeUpdate(tx *gorm.DB) error {
	c.UpdatedAt = time.Now().UTC()
	return nil
}
