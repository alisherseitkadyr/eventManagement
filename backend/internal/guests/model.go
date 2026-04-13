package guests

import (
	"time"

	"event/internal/shared/utils"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Guest struct {
	ID               string         `gorm:"primaryKey;size:36" json:"id"`
	EventID          string         `gorm:"size:36;not null;index" json:"eventId"`
	Name             string         `gorm:"not null" json:"name"`
	PersonalGreeting string         `json:"personalGreeting,omitempty"`
	Count            int            `gorm:"default:1" json:"count"`
	Side             string         `gorm:"size:20;not null" json:"side"` // groom, bride, common
	Category         string         `gorm:"size:30;not null" json:"category"`
	Status           string         `gorm:"size:20;default:'pending'" json:"status"`
	Phone            string         `json:"phone,omitempty"`
	Email            string         `json:"email,omitempty"`
	Token            string         `gorm:"size:64;uniqueIndex" json:"token"`
	IsVip            bool           `json:"isVip"`
	IsElder          bool           `json:"isElder"`
	HasChildren      bool           `json:"hasChildren"`
	AssignedStageIDs pq.StringArray `gorm:"type:text[]" json:"assignedStageIds"`
	Comment          string         `json:"comment,omitempty"`
	RespondedAt      *time.Time     `json:"respondedAt,omitempty"`
	OpenedAt         *time.Time     `json:"openedAt,omitempty"`
	FamilyGroupID    string         `gorm:"size:36" json:"familyGroupId,omitempty"`
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
}

func (g *Guest) BeforeCreate(tx *gorm.DB) error {
	if g.ID == "" {
		g.ID = utils.GenerateShortID("gst")
	}
	if g.Token == "" {
		g.Token = utils.GenerateToken(12)
	}
	g.CreatedAt = time.Now().UTC()
	g.UpdatedAt = time.Now().UTC()
	return nil
}

func (g *Guest) BeforeUpdate(tx *gorm.DB) error {
	g.UpdatedAt = time.Now().UTC()
	return nil
}

type AddGuestInput struct {
	Name             string   `json:"name"`
	Count            int      `json:"count"`
	Side             string   `json:"side"`
	Category         string   `json:"category"`
	Phone            string   `json:"phone,omitempty"`
	IsVip            bool     `json:"isVip"`
	IsElder          bool     `json:"isElder"`
	AssignedStageIDs []string `json:"assignedStageIds,omitempty"`
}
