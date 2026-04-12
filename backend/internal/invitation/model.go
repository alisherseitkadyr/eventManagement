package invitation

import (
	"event/internal/events"
	"event/internal/guests"
	"event/internal/rsvp"
)

type InvitationPayload struct {
	Event         *events.EventResponse  `json:"event"`
	Guest         *guests.Guest          `json:"guest"`
	VisibleStages []events.StageResponse `json:"visibleStages"`
	Response      *rsvp.RSVPResponse     `json:"response"`
	InvitationURL string                 `json:"invitationUrl"`
}
