package templates

import (
	"context"
	"event/internal/shared/utils"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lib/pq"
)

type Repository interface {
	List(activeOnly bool) ([]Template, error)
	GetByID(id string) (*Template, error)
	GetBlocks(templateID string) ([]TemplateBlock, error)
	Create(template *Template) error
	Update(template *Template) error
	Delete(id string) error
}

type repo struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repo{db: db}
}

func (r *repo) Create(template *Template) error {
	if template.ID == "" {
		template.ID = utils.GenerateShortID("tpl")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `
		INSERT INTO templates (id, name, description, type, template_style, accent_color,
			languages, preview_image_url, is_active, sort_order, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`, template.ID, template.Name, template.Description, template.Type, template.TemplateStyle,
		template.AccentColor, template.Languages, template.PreviewImageURL, template.IsActive,
		template.SortOrder, template.CreatedAt, template.UpdatedAt)
	return err
}

func (r *repo) Update(template *Template) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `
		UPDATE templates SET name=$1, description=$2, type=$3, template_style=$4,
			accent_color=$5, languages=$6, preview_image_url=$7, is_active=$8,
			sort_order=$9, updated_at=$10
		WHERE id = $11
	`, template.Name, template.Description, template.Type, template.TemplateStyle,
		template.AccentColor, template.Languages, template.PreviewImageURL, template.IsActive,
		template.SortOrder, time.Now().UTC(), template.ID)
	return err
}

func (r *repo) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `DELETE FROM templates WHERE id = $1`, id)
	return err
}	

func (r *repo) List(activeOnly bool) ([]Template, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
        SELECT id, name, description, type, template_style, accent_color,
               languages, preview_image_url, is_active, sort_order,
               created_at, updated_at
        FROM templates`
	if activeOnly {
		query += " WHERE is_active = true"
	}
	query += " ORDER BY sort_order ASC, name ASC"

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []Template
	for rows.Next() {
		var t Template
		var langs []string
		err := rows.Scan(
			&t.ID, &t.Name, &t.Description, &t.Type, &t.TemplateStyle,
			&t.AccentColor, &langs, &t.PreviewImageURL, &t.IsActive,
			&t.SortOrder, &t.CreatedAt, &t.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		t.Languages = pq.StringArray(langs)
		templates = append(templates, t)
	}
	return templates, nil
}

func (r *repo) GetByID(id string) (*Template, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var t Template
	var langs []string
	err := r.db.QueryRow(ctx, `
        SELECT id, name, description, type, template_style, accent_color,
               languages, preview_image_url, is_active, sort_order,
               created_at, updated_at
        FROM templates WHERE id = $1`, id,
	).Scan(
		&t.ID, &t.Name, &t.Description, &t.Type, &t.TemplateStyle,
		&t.AccentColor, &langs, &t.PreviewImageURL, &t.IsActive,
		&t.SortOrder, &t.CreatedAt, &t.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	t.Languages = pq.StringArray(langs)
	return &t, nil
}

func (r *repo) GetBlocks(templateID string) ([]TemplateBlock, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := r.db.Query(ctx, `
        SELECT id, template_id, block_id, label, icon, enabled,
               sort_order, settings, created_at, updated_at
        FROM template_blocks
        WHERE template_id = $1
        ORDER BY sort_order ASC`, templateID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blocks []TemplateBlock
	for rows.Next() {
		var b TemplateBlock
		err := rows.Scan(
			&b.ID, &b.TemplateID, &b.BlockID, &b.Label, &b.Icon,
			&b.Enabled, &b.SortOrder, &b.Settings,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		blocks = append(blocks, b)
	}
	return blocks, nil
}
