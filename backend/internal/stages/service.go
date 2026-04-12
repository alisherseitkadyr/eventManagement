package stages

type Service interface {
	Create(stage *Stage) error
	ListByEventID(eventID string) ([]Stage, error)
	Update(id string, updates map[string]interface{}) error
	Delete(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(stage *Stage) error {
	return s.repo.Create(stage)
}

func (s *service) ListByEventID(eventID string) ([]Stage, error) {
	return s.repo.ListByEventID(eventID)
}

func (s *service) Update(id string, updates map[string]interface{}) error {
	return s.repo.Update(id, updates)
}

func (s *service) Delete(id string) error {
	return s.repo.Delete(id)
}
