package constructor

import (
	"gorm.io/gorm"
)

type Repository interface {
	GetByEventID(eventID string) (*ConstructorSettings, error)
	Save(settings *ConstructorSettings) error
}

type repo struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repo{db: db}
}

func (r *repo) GetByEventID(eventID string) (*ConstructorSettings, error) {
	var settings ConstructorSettings
	err := r.db.Where("event_id = ?", eventID).First(&settings).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return &settings, err
}

func (r *repo) Save(settings *ConstructorSettings) error {
	return r.db.Save(settings).Error
}

type Service interface {
	GetBlocks(eventID string) ([]ConstructorBlock, error)
	UpdateBlocks(eventID string, blocks []ConstructorBlock) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetBlocks(eventID string) ([]ConstructorBlock, error) {
	settings, err := s.repo.GetByEventID(eventID)
	if err != nil {
		return nil, err
	}
	if settings == nil {
		// return default blocks
		return DefaultBlocks(), nil
	}
	return settings.Blocks, nil
}

func (s *service) UpdateBlocks(eventID string, blocks []ConstructorBlock) error {
	settings, err := s.repo.GetByEventID(eventID)
	if err != nil {
		return err
	}
	if settings == nil {
		settings = &ConstructorSettings{
			EventID: eventID,
			Blocks:  blocks,
		}
	} else {
		settings.Blocks = blocks
	}
	return s.repo.Save(settings)
}

func DefaultBlocks() []ConstructorBlock {
	return []ConstructorBlock{
		{ID: "cover", Label: "Обложка", Icon: "🖼", Enabled: true},
		{ID: "names", Label: "Имена", Icon: "💑", Enabled: true},
		{ID: "countdown", Label: "Обратный отсчет", Icon: "⏳", Enabled: true},
		{ID: "story", Label: "Обращение", Icon: "💌", Enabled: true},
		{ID: "program", Label: "Программа", Icon: "📋", Enabled: true},
		{ID: "map", Label: "Карта", Icon: "📍", Enabled: true},
		{ID: "dresscode", Label: "Дресс-код", Icon: "👗", Enabled: false},
		{ID: "gallery", Label: "Галерея", Icon: "📸", Enabled: false},
		{ID: "rsvp", Label: "RSVP", Icon: "✅", Enabled: true},
		{ID: "contacts", Label: "Контакты", Icon: "📞", Enabled: true},
	}
}
