package stages

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"event/internal/shared/utils"
)

type Repository interface {
	Create(stage *Stage) error
	ListByEventID(eventID string) ([]Stage, error)
	GetByID(id string) (*Stage, error)
	Update(id string, updates map[string]interface{}) error
	Delete(id string) error
}

type repo struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repo{db: db}
}

const stageColumns = `id, event_id, name_ru, name_kz, date, time, place, address,
	map_url, description_ru, description_kz, emoji, sort_order, created_at, updated_at`

func scanStage(row interface{ Scan(...any) error }) (*Stage, error) {
	var s Stage
	err := row.Scan(
		&s.ID, &s.EventID, &s.NameRu, &s.NameKz,
		&s.Date, &s.Time, &s.Place, &s.Address,
		&s.MapURL, &s.DescriptionRu, &s.DescriptionKz,
		&s.Emoji, &s.SortOrder, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *repo) Create(stage *Stage) error {
	if stage.ID == "" {
		stage.ID = utils.GenerateShortID("stg")
	}
	now := time.Now().UTC()
	if stage.CreatedAt.IsZero() {
		stage.CreatedAt = now
	}
	if stage.UpdatedAt.IsZero() {
		stage.UpdatedAt = now
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `
		INSERT INTO stages (
			id, event_id, name_ru, name_kz, date, time, place, address,
			map_url, description_ru, description_kz, emoji, sort_order,
			created_at, updated_at
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
		stage.ID, stage.EventID, stage.NameRu, stage.NameKz,
		stage.Date, stage.Time, stage.Place, stage.Address,
		stage.MapURL, stage.DescriptionRu, stage.DescriptionKz,
		stage.Emoji, stage.SortOrder, stage.CreatedAt, stage.UpdatedAt,
	)
	return err
}

func (r *repo) ListByEventID(eventID string) ([]Stage, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	rows, err := r.db.Query(ctx,
		"SELECT "+stageColumns+" FROM stages WHERE event_id=$1 ORDER BY sort_order ASC", eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]Stage, 0)
	for rows.Next() {
		s, err := scanStage(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *s)
	}
	return out, nil
}

func (r *repo) GetByID(id string) (*Stage, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	row := r.db.QueryRow(ctx,
		"SELECT "+stageColumns+" FROM stages WHERE id=$1", id)
	s, err := scanStage(row)
	if err != nil {
		if strings.Contains(err.Error(), "no rows") {
			return nil, nil
		}
		return nil, err
	}
	return s, nil
}

func (r *repo) Update(id string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}
	parts := make([]string, 0, len(updates))
	args := make([]interface{}, 0, len(updates)+1)
	i := 1
	for k, v := range updates {
		parts = append(parts, fmt.Sprintf("%s=$%d", k, i))
		args = append(args, v)
		i++
	}
	args = append(args, id)
	query := fmt.Sprintf("UPDATE stages SET %s WHERE id=$%d", strings.Join(parts, ","), i)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, query, args...)
	return err
}

func (r *repo) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, "DELETE FROM stages WHERE id=$1", id)
	return err
}
