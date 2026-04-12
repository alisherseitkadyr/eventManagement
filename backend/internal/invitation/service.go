package invitation

import (
	"errors"
	"fmt"

	"event/internal/events"
	"event/internal/guests"
	"event/internal/rsvp"
)

type Service interface {
	GetByToken(token string) (*InvitationPayload, error)
	MarkOpened(token string) error
	BuildInvitationURL(baseURL, token string) string
}

type service struct {
	eventService events.Service
	guestService guests.Service
	rsvpService  rsvp.Service
}

func NewService(es events.Service, gs guests.Service, rs rsvp.Service) Service {
	return &service{
		eventService: es,
		guestService: gs,
		rsvpService:  rs,
	}
}

func (s *service) GetByToken(token string) (*InvitationPayload, error) {
	guest, err := s.guestService.GetByToken(token)
	if err != nil || guest == nil {
		return nil, errors.New("invitation not found")
	}

	event, err := s.eventService.GetByID(guest.EventID)
	if err != nil || event == nil {
		return nil, fmt.Errorf("event not found: %w", err)
	}

	visibleStages := filterStagesForGuest(event.Stages, guest.AssignedStageIDs)

	rsvpResp, _ := s.rsvpService.GetByToken(token)

	return &InvitationPayload{
		Event:         event,
		Guest:         guest,
		VisibleStages: visibleStages,
		Response:      rsvpResp,
	}, nil
}

func (s *service) MarkOpened(token string) error {
	return s.guestService.MarkOpened(token)
}

func (s *service) BuildInvitationURL(baseURL, token string) string {
	return fmt.Sprintf("%s/i/%s", baseURL, token)
}

func filterStagesForGuest(allStages []events.StageResponse, assignedIDs []string) []events.StageResponse {
	if len(assignedIDs) == 0 {
		return allStages
	}
	allowed := make(map[string]bool, len(assignedIDs))
	for _, id := range assignedIDs {
		allowed[id] = true
	}
	filtered := make([]events.StageResponse, 0, len(allStages))
	for _, s := range allStages {
		if allowed[s.ID] {
			filtered = append(filtered, s)
		}
	}
	return filtered
}
