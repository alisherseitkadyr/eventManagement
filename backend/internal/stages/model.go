package stages

import (
	"time"

	"event/internal/shared/utils"
	"gorm.io/gorm"
)

type Stage struct {
	ID            string    `gorm:"primaryKey;size:36" json:"id"`
	EventID       string    `gorm:"size:36;not null;index" json:"eventId"`
	NameRu        string    `gorm:"not null" json:"-"`
	NameKz        string    `gorm:"not null" json:"-"`
	Date          string    `gorm:"type:date;not null" json:"date"`
	Time          string    `gorm:"type:time;not null" json:"time"`
	Place         string    `gorm:"not null" json:"place"`
	Address       string    `json:"address"`
	MapURL        string    `json:"mapUrl"`
	DescriptionRu string    `json:"-"`
	DescriptionKz string    `json:"-"`
	Emoji         string    `gorm:"size:10" json:"emoji"`
	SortOrder     int       `gorm:"default:0" json:"sortOrder"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func (s *Stage) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = utils.GenerateShortID("stg")
	}
	s.CreatedAt = time.Now().UTC()
	s.UpdatedAt = time.Now().UTC()
	return nil
}

func (s *Stage) BeforeUpdate(tx *gorm.DB) error {
	s.UpdatedAt = time.Now().UTC()
	return nil
}
