package events

import (
	"errors"
	"time"

	"github.com/lib/pq"

	"event/internal/stages"
)

// Define local interface for guest repository (only what events needs)
type GuestStatsRepo interface {
	ListByEventID(eventID string) ([]GuestForStats, error)
}

type GuestForStats struct {
	Count  int
	Status string
}

type Service interface {
	Create(input CreateEventInput) (*EventResponse, error)
	List() ([]*EventResponse, error)
	GetByID(id string) (*EventResponse, error)
	GetStats(eventID string) (*EventStats, error)
	Update(id string, data map[string]interface{}) (*EventResponse, error)
	Publish(id string) error
	Unpublish(id string) error
}

type service struct {
	repo      Repository
	stageRepo stages.Repository
	guestRepo GuestStatsRepo
}

func NewService(repo Repository, stageRepo stages.Repository, guestRepo GuestStatsRepo) Service {
	return &service{
		repo:      repo,
		stageRepo: stageRepo,
		guestRepo: guestRepo,
	}
}

func (s *service) List() ([]*EventResponse, error) {
	evts, err := s.repo.List()
	if err != nil {
		return nil, err
	}
	out := make([]*EventResponse, 0, len(evts))
	for i := range evts {
		out = append(out, s.toResponse(&evts[i], nil))
	}
	return out, nil
}

func (s *service) GetStats(eventID string) (*EventStats, error) {
	guestsList, err := s.guestRepo.ListByEventID(eventID)
	if err != nil {
		return nil, err
	}

	stats := &EventStats{TotalGuests: len(guestsList)}
	for _, g := range guestsList {
		stats.TotalPeople += g.Count
		switch g.Status {
		case "confirmed":
			stats.Confirmed++
			stats.ConfirmedPeople += g.Count
		case "declined":
			stats.Declined++
		case "maybe":
			stats.Maybe++
		case "pending":
			stats.Pending++
		}
	}
	return stats, nil
}

func (s *service) Create(input CreateEventInput) (*EventResponse, error) {
	event := &Event{
		Type:          input.Type,
		TemplateStyle: input.TemplateStyle,
		Languages:     input.Languages,
		TitleRu:       input.Title.Ru,
		TitleKz:       input.Title.Kz,
		AccentColor:   "#7A2E3A",
	}
	if err := s.repo.Create(event); err != nil {
		return nil, err
	}
	return s.toResponse(event, nil), nil
}

func (s *service) GetByID(id string) (*EventResponse, error) {
	event, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if event == nil {
		return nil, errors.New("event not found")
	}
	stagesList, _ := s.stageRepo.ListByEventID(id)
	return s.toResponse(event, stagesList), nil
}

func (s *service) Update(id string, data map[string]interface{}) (*EventResponse, error) {
	mapped := mapEventUpdates(data)
	if err := s.repo.Update(id, mapped); err != nil {
		return nil, err
	}
	return s.GetByID(id)
}

func (s *service) Publish(id string) error   { return s.repo.Publish(id) }
func (s *service) Unpublish(id string) error { return s.repo.Unpublish(id) }

// mapEventUpdates converts frontend camelCase JSON keys to DB snake_case column names.
// Localized fields ({ ru, kz }) are expanded into separate _ru / _kz columns.
func mapEventUpdates(raw map[string]interface{}) map[string]interface{} {
	mapped := make(map[string]interface{})

	toLocalized := func(prefix string, v interface{}) {
		if m, ok := v.(map[string]interface{}); ok {
			if ru, ok := m["ru"]; ok {
				mapped[prefix+"_ru"] = ru
			}
			if kz, ok := m["kz"]; ok {
				mapped[prefix+"_kz"] = kz
			}
		}
	}

	for k, v := range raw {
		switch k {
		case "type", "published":
			mapped[k] = v
		case "templateStyle":
			mapped["template_style"] = v
		case "accentColor":
			mapped["accent_color"] = v
		case "coverImageUrl":
			mapped["cover_image_url"] = v
		case "coordinatorName":
			mapped["coordinator_name"] = v
		case "coordinatorPhone":
			mapped["coordinator_phone"] = v
		case "title":
			toLocalized("title", v)
		case "subtitle":
			toLocalized("subtitle", v)
		case "description":
			toLocalized("description", v)
		case "dressCode":
			toLocalized("dress_code", v)
		case "giftWishes":
			toLocalized("gift_wishes", v)
		case "languages":
			if arr, ok := v.([]interface{}); ok {
				strs := make([]string, 0, len(arr))
				for _, item := range arr {
					if s, ok := item.(string); ok {
						strs = append(strs, s)
					}
				}
				mapped["languages"] = pq.Array(strs)
			}
		// Skip read-only / computed fields
		case "id", "createdAt", "updatedAt", "stages":
		}
	}

	if len(mapped) > 0 {
		mapped["updated_at"] = time.Now().UTC()
	}
	return mapped
}

func (s *service) toResponse(event *Event, stagesList []stages.Stage) *EventResponse {
	resp := &EventResponse{
		ID:               event.ID,
		Type:             event.Type,
		TemplateStyle:    event.TemplateStyle,
		Languages:        event.Languages,
		AccentColor:      event.AccentColor,
		Title:            LocalizedText{Ru: event.TitleRu, Kz: event.TitleKz},
		CoordinatorName:  event.CoordinatorName,
		CoordinatorPhone: event.CoordinatorPhone,
		Published:        event.Published,
		CoverImageURL:    event.CoverImageURL,
		CreatedAt:        event.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:        event.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	if event.SubtitleRu != "" || event.SubtitleKz != "" {
		resp.Subtitle = &LocalizedText{Ru: event.SubtitleRu, Kz: event.SubtitleKz}
	}
	if event.DescriptionRu != "" || event.DescriptionKz != "" {
		resp.Description = &LocalizedText{Ru: event.DescriptionRu, Kz: event.DescriptionKz}
	}
	if event.DressCodeRu != "" || event.DressCodeKz != "" {
		resp.DressCode = &LocalizedText{Ru: event.DressCodeRu, Kz: event.DressCodeKz}
	}
	if event.GiftWishesRu != "" || event.GiftWishesKz != "" {
		resp.GiftWishes = &LocalizedText{Ru: event.GiftWishesRu, Kz: event.GiftWishesKz}
	}

	resp.Stages = make([]StageResponse, 0, len(stagesList))
	for _, st := range stagesList {
		sr := StageResponse{
			ID:      st.ID,
			Date:    st.Date,
			Time:    st.Time,
			Place:   st.Place,
			Address: st.Address,
			MapURL:  st.MapURL,
			Emoji:   st.Emoji,
			Name:    LocalizedText{Ru: st.NameRu, Kz: st.NameKz},
		}
		if st.DescriptionRu != "" || st.DescriptionKz != "" {
			sr.Description = &LocalizedText{Ru: st.DescriptionRu, Kz: st.DescriptionKz}
		}
		resp.Stages = append(resp.Stages, sr)
	}

	return resp
}
