package events

import (
	"time"

	"event/internal/shared/utils"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Event struct {
	ID               string         `gorm:"primaryKey;size:36" json:"id"`
	Type             string         `gorm:"size:50;not null" json:"type"`
	TemplateStyle    string         `gorm:"size:50;not null;default:'elegant'" json:"templateStyle"`
	Languages        pq.StringArray `gorm:"type:text[];default:'{ru,kz}'" json:"languages"`
	AccentColor      string         `gorm:"size:20;default:'#7A2E3A'" json:"accentColor"`
	TitleRu          string         `gorm:"not null" json:"-"`
	TitleKz          string         `gorm:"not null" json:"-"`
	SubtitleRu       string         `json:"-"`
	SubtitleKz       string         `json:"-"`
	DescriptionRu    string         `json:"-"`
	DescriptionKz    string         `json:"-"`
	CoverImageURL    string         `json:"coverImageUrl"`
	DressCodeRu      string         `json:"-"`
	DressCodeKz      string         `json:"-"`
	GiftWishesRu     string         `json:"-"`
	GiftWishesKz     string         `json:"-"`
	CoordinatorName  string         `json:"coordinatorName"`
	CoordinatorPhone string         `json:"coordinatorPhone"`
	Published        bool           `gorm:"default:false" json:"published"`
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) error {
	if e.ID == "" {
		e.ID = utils.GenerateShortID("evt")
	}
	e.CreatedAt = time.Now().UTC()
	e.UpdatedAt = time.Now().UTC()
	return nil
}

func (e *Event) BeforeUpdate(tx *gorm.DB) error {
	e.UpdatedAt = time.Now().UTC()
	return nil
}

// JSON response structure matching frontend EventProject
type EventResponse struct {
	ID               string          `json:"id"`
	Type             string          `json:"type"`
	TemplateStyle    string          `json:"templateStyle"`
	Languages        []string        `json:"languages"`
	AccentColor      string          `json:"accentColor"`
	Title            LocalizedText   `json:"title"`
	Subtitle         *LocalizedText  `json:"subtitle,omitempty"`
	Description      *LocalizedText  `json:"description,omitempty"`
	Stages           []StageResponse `json:"stages"`
	CoverImageURL    string          `json:"coverImageUrl,omitempty"`
	DressCode        *LocalizedText  `json:"dressCode,omitempty"`
	GiftWishes       *LocalizedText  `json:"giftWishes,omitempty"`
	CoordinatorName  string          `json:"coordinatorName"`
	CoordinatorPhone string          `json:"coordinatorPhone"`
	CreatedAt        string          `json:"createdAt"`
	UpdatedAt        string          `json:"updatedAt"`
	Published        bool            `json:"published"`
}

type LocalizedText struct {
	Ru string `json:"ru"`
	Kz string `json:"kz"`
}

type StageResponse struct {
	ID          string         `json:"id"`
	Name        LocalizedText  `json:"name"`
	Date        string         `json:"date"`
	Time        string         `json:"time"`
	Place       string         `json:"place"`
	Address     string         `json:"address"`
	MapURL      string         `json:"mapUrl,omitempty"`
	Description *LocalizedText `json:"description,omitempty"`
	Emoji       string         `json:"emoji,omitempty"`
}

type CreateEventInput struct {
	Type          string        `json:"type"`
	Title         LocalizedText `json:"title"`
	TemplateStyle string        `json:"templateStyle"`
	Languages     []string      `json:"languages"`
}

type EventStats struct {
	TotalGuests     int `json:"totalGuests"`
	TotalPeople     int `json:"totalPeople"`
	Confirmed       int `json:"confirmed"`
	ConfirmedPeople int `json:"confirmedPeople"`
	Declined        int `json:"declined"`
	Maybe           int `json:"maybe"`
	Pending         int `json:"pending"`
}
