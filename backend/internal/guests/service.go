package guests

import (
	"errors"
	"time"

	"github.com/lib/pq"
)

// Define local interface for event repository (only what guests needs)
type EventValidator interface {
	GetByID(id string) (*EventInfo, error)
}

type EventInfo struct {
	ID string
}

type Service interface {
	Add(eventID string, input AddGuestInput) (*Guest, error)
	GetByID(id string) (*Guest, error)
	GetByToken(token string) (*Guest, error)
	ListByEventID(eventID string) ([]Guest, error)
	Update(id string, updates map[string]interface{}) (*Guest, error)
	Delete(id string) error
	MarkOpened(token string) error
}

type service struct {
	repo      Repository
	eventRepo EventValidator
}

func NewService(repo Repository, eventRepo EventValidator) Service {
	return &service{repo: repo, eventRepo: eventRepo}
}

func (s *service) Add(eventID string, input AddGuestInput) (*Guest, error) {
	_, err := s.eventRepo.GetByID(eventID)
	if err != nil {
		return nil, errors.New("event not found")
	}
	guest := &Guest{
		EventID:          eventID,
		Name:             input.Name,
		Count:            input.Count,
		Side:             input.Side,
		Category:         input.Category,
		Phone:            input.Phone,
		IsVip:            input.IsVip,
		IsElder:          input.IsElder,
		AssignedStageIDs: input.AssignedStageIDs,
		Status:           "pending",
	}
	if err := s.repo.Create(guest); err != nil {
		return nil, err
	}
	return guest, nil
}

func (s *service) GetByID(id string) (*Guest, error)        { return s.repo.GetByID(id) }
func (s *service) GetByToken(token string) (*Guest, error)  { return s.repo.GetByToken(token) }
func (s *service) ListByEventID(id string) ([]Guest, error) { return s.repo.ListByEventID(id) }
func (s *service) Delete(id string) error                   { return s.repo.Delete(id) }
func (s *service) MarkOpened(token string) error            { return s.repo.MarkOpened(token) }

func (s *service) Update(id string, updates map[string]interface{}) (*Guest, error) {
	mapped := mapGuestUpdates(updates)
	if err := s.repo.Update(id, mapped); err != nil {
		return nil, err
	}
	return s.repo.GetByID(id)
}

// mapGuestUpdates converts frontend camelCase JSON keys to DB snake_case column names.
func mapGuestUpdates(raw map[string]interface{}) map[string]interface{} {
	mapped := make(map[string]interface{})

	for k, v := range raw {
		switch k {
		case "name", "count", "side", "category", "status", "phone", "email", "comment", "token":
			mapped[k] = v
		case "personalGreeting":
			mapped["personal_greeting"] = v
		case "isVip":
			mapped["is_vip"] = v
		case "isElder":
			mapped["is_elder"] = v
		case "hasChildren":
			mapped["has_children"] = v
		case "assignedStageIds":
			if arr, ok := v.([]interface{}); ok {
				strs := make([]string, 0, len(arr))
				for _, item := range arr {
					if s, ok := item.(string); ok {
						strs = append(strs, s)
					}
				}
				mapped["assigned_stage_ids"] = pq.Array(strs)
			}
		case "familyGroupId":
			mapped["family_group_id"] = v
		// Skip immutable fields
		case "id", "eventId", "createdAt", "updatedAt", "openedAt", "respondedAt":
		}
	}

	if len(mapped) > 0 {
		mapped["updated_at"] = time.Now().UTC()
	}
	return mapped
}
