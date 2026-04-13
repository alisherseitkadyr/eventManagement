package templates

import "fmt"

type Service interface {
	List() ([]TemplateResponse, error)
	GetByID(id string) (*TemplateResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) List() ([]TemplateResponse, error) {
	templates, err := s.repo.List(true)
	if err != nil {
		return nil, err
	}

	responses := make([]TemplateResponse, 0, len(templates))
	for _, t := range templates {
		blocks, _ := s.repo.GetBlocks(t.ID)
		resp := s.toResponse(&t, blocks)
		responses = append(responses, *resp)
		fmt.Printf("Loaded template: %s with %d blocks\n", t.Name, len(blocks))
	}
	return responses, nil
}

func (s *service) GetByID(id string) (*TemplateResponse, error) {
	template, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	blocks, _ := s.repo.GetBlocks(id)
	return s.toResponse(template, blocks), nil
}

func (s *service) toResponse(t *Template, blocks []TemplateBlock) *TemplateResponse {
	blockResponses := make([]BlockResponse, 0, len(blocks))
	for _, b := range blocks {
		blockResponses = append(blockResponses, BlockResponse{
			BlockID:  b.BlockID,
			Label:    b.Label,
			Icon:     b.Icon,
			Enabled:  b.Enabled,
			Settings: b.Settings,
		})
	}

	return &TemplateResponse{
		ID:              t.ID,
		Name:            t.Name,
		Description:     t.Description,
		Type:            t.Type,
		TemplateStyle:   t.TemplateStyle,
		AccentColor:     t.AccentColor,
		Languages:       t.Languages,
		PreviewImageURL: t.PreviewImageURL,
		Blocks:          blockResponses,
	}
}
