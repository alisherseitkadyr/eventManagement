package rsvp

import (
	"time"

	"event/internal/guests"
)

type RSVPResponse struct {
	GuestID             string `json:"guestId"`
	Status              string `json:"status"`
	Count               int    `json:"count"`
	NeedsTransfer       bool   `json:"needsTransfer"`
	HasChildren         bool   `json:"hasChildren"`
	DietaryRestrictions string `json:"dietaryRestrictions,omitempty"`
	Comment             string `json:"comment,omitempty"`
}

type RSVPSubmitInput struct {
	Token               string `json:"token"`
	Status              string `json:"status"`
	Count               int    `json:"count,omitempty"`
	Comment             string `json:"comment,omitempty"`
	NeedsTransfer       bool   `json:"needsTransfer"`
	HasChildren         bool   `json:"hasChildren"`
	DietaryRestrictions string `json:"dietaryRestrictions,omitempty"`
}

type Service interface {
	Submit(input RSVPSubmitInput) (*RSVPResponse, error)
	GetByToken(token string) (*RSVPResponse, error)
}

type service struct {
	guestRepo guests.Repository
}

func NewService(guestRepo guests.Repository) Service {
	return &service{guestRepo: guestRepo}
}

func (s *service) Submit(input RSVPSubmitInput) (*RSVPResponse, error) {
	guest, err := s.guestRepo.GetByToken(input.Token)
	if err != nil {
		return nil, err
	}

	updates := map[string]interface{}{
		"status":       input.Status,
		"responded_at": time.Now().UTC(),
	}
	if input.Comment != "" {
		updates["comment"] = input.Comment
	}
	if input.Status == "confirmed" && input.Count > 0 {
		updates["count"] = input.Count
	}

	if err := s.guestRepo.Update(guest.ID, updates); err != nil {
		return nil, err
	}

	return &RSVPResponse{
		GuestID:             guest.ID,
		Status:              input.Status,
		Count:               input.Count,
		NeedsTransfer:       input.NeedsTransfer,
		HasChildren:         input.HasChildren,
		DietaryRestrictions: input.DietaryRestrictions,
		Comment:             input.Comment,
	}, nil
}

func (s *service) GetByToken(token string) (*RSVPResponse, error) {
	guest, err := s.guestRepo.GetByToken(token)
	if err != nil {
		return nil, err
	}

	if guest.Status == "pending" {
		return nil, nil
	}

	return &RSVPResponse{
		GuestID: guest.ID,
		Status:  guest.Status,
		Count:   guest.Count,
		Comment: guest.Comment,
	}, nil
}
