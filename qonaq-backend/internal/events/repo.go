package events

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lib/pq"

	"event/internal/shared/utils"
)

type Repository interface {
	Create(event *Event) error
	List() ([]Event, error)
	GetByID(id string) (*Event, error)
	Update(id string, updates map[string]interface{}) error
	Delete(id string) error
	Publish(id string) error
	Unpublish(id string) error
}

type repo struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repo{db: db}
}

func (r *repo) Create(event *Event) error {
	if event.ID == "" {
		event.ID = utils.GenerateShortID("evt")
	}
	now := time.Now().UTC()
	if event.CreatedAt.IsZero() {
		event.CreatedAt = now
	}
	if event.UpdatedAt.IsZero() {
		event.UpdatedAt = now
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `
		INSERT INTO events (
			id, type, template_style, languages, accent_color,
			title_ru, title_kz, subtitle_ru, subtitle_kz,
			description_ru, description_kz, cover_image_url,
			dress_code_ru, dress_code_kz, gift_wishes_ru, gift_wishes_kz,
			coordinator_name, coordinator_phone, published, created_at, updated_at
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
		event.ID, event.Type, event.TemplateStyle, pq.Array(event.Languages), event.AccentColor,
		event.TitleRu, event.TitleKz, event.SubtitleRu, event.SubtitleKz,
		event.DescriptionRu, event.DescriptionKz, event.CoverImageURL,
		event.DressCodeRu, event.DressCodeKz, event.GiftWishesRu, event.GiftWishesKz,
		event.CoordinatorName, event.CoordinatorPhone, event.Published,
		event.CreatedAt, event.UpdatedAt,
	)
	return err
}

func (r *repo) List() ([]Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	rows, err := r.db.Query(ctx, `
		SELECT
			id, type, template_style, languages, accent_color,
			title_ru, title_kz,
			COALESCE(subtitle_ru,''), COALESCE(subtitle_kz,''),
			COALESCE(description_ru,''), COALESCE(description_kz,''),
			COALESCE(cover_image_url,''),
			COALESCE(dress_code_ru,''), COALESCE(dress_code_kz,''),
			COALESCE(gift_wishes_ru,''), COALESCE(gift_wishes_kz,''),
			COALESCE(coordinator_name,''), COALESCE(coordinator_phone,''),
			published, created_at, updated_at
		FROM events ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]Event, 0)
	for rows.Next() {
		var ev Event
		var langs []string
		if err := rows.Scan(
			&ev.ID, &ev.Type, &ev.TemplateStyle, &langs, &ev.AccentColor,
			&ev.TitleRu, &ev.TitleKz,
			&ev.SubtitleRu, &ev.SubtitleKz,
			&ev.DescriptionRu, &ev.DescriptionKz,
			&ev.CoverImageURL,
			&ev.DressCodeRu, &ev.DressCodeKz,
			&ev.GiftWishesRu, &ev.GiftWishesKz,
			&ev.CoordinatorName, &ev.CoordinatorPhone,
			&ev.Published, &ev.CreatedAt, &ev.UpdatedAt,
		); err != nil {
			return nil, err
		}
		ev.Languages = pq.StringArray(langs)
		out = append(out, ev)
	}
	return out, nil
}

func (r *repo) GetByID(id string) (*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var ev Event
	var langs []string
	row := r.db.QueryRow(ctx, `
		SELECT
			id, type, template_style, languages, accent_color,
			title_ru, title_kz,
			COALESCE(subtitle_ru,''), COALESCE(subtitle_kz,''),
			COALESCE(description_ru,''), COALESCE(description_kz,''),
			COALESCE(cover_image_url,''),
			COALESCE(dress_code_ru,''), COALESCE(dress_code_kz,''),
			COALESCE(gift_wishes_ru,''), COALESCE(gift_wishes_kz,''),
			COALESCE(coordinator_name,''), COALESCE(coordinator_phone,''),
			published, created_at, updated_at
		FROM events WHERE id=$1`, id)

	err := row.Scan(
		&ev.ID, &ev.Type, &ev.TemplateStyle, &langs, &ev.AccentColor,
		&ev.TitleRu, &ev.TitleKz,
		&ev.SubtitleRu, &ev.SubtitleKz,
		&ev.DescriptionRu, &ev.DescriptionKz,
		&ev.CoverImageURL,
		&ev.DressCodeRu, &ev.DressCodeKz,
		&ev.GiftWishesRu, &ev.GiftWishesKz,
		&ev.CoordinatorName, &ev.CoordinatorPhone,
		&ev.Published, &ev.CreatedAt, &ev.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "no rows") {
			return nil, nil
		}
		return nil, err
	}
	ev.Languages = pq.StringArray(langs)
	return &ev, nil
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
	query := fmt.Sprintf("UPDATE events SET %s WHERE id=$%d", strings.Join(parts, ","), i)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, query, args...)
	return err
}

func (r *repo) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, "DELETE FROM events WHERE id=$1", id)
	return err
}

func (r *repo) Publish(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, "UPDATE events SET published=true, updated_at=NOW() WHERE id=$1", id)
	return err
}

func (r *repo) Unpublish(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, "UPDATE events SET published=false, updated_at=NOW() WHERE id=$1", id)
	return err
}
