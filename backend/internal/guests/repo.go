package guests

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
	Create(guest *Guest) error
	GetByID(id string) (*Guest, error)
	GetByToken(token string) (*Guest, error)
	ListByEventID(eventID string) ([]Guest, error)
	Update(id string, updates map[string]interface{}) error
	Delete(id string) error
	MarkOpened(token string) error
}

type repo struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repo{db: db}
}

const guestColumns = `id, event_id, name, personal_greeting, count, side, category, status,
	phone, email, token, is_vip, is_elder, has_children, assigned_stage_ids,
	comment, responded_at, opened_at, family_group_id, created_at, updated_at`

func scanGuest(row interface{ Scan(...any) error }) (*Guest, error) {
	var g Guest
	var assigned []string
	err := row.Scan(
		&g.ID, &g.EventID, &g.Name, &g.PersonalGreeting, &g.Count,
		&g.Side, &g.Category, &g.Status,
		&g.Phone, &g.Email, &g.Token,
		&g.IsVip, &g.IsElder, &g.HasChildren, &assigned,
		&g.Comment, &g.RespondedAt, &g.OpenedAt, &g.FamilyGroupID,
		&g.CreatedAt, &g.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	g.AssignedStageIDs = pq.StringArray(assigned)
	return &g, nil
}

func (r *repo) Create(guest *Guest) error {
	if guest.ID == "" {
		guest.ID = utils.GenerateShortID("gst")
	}
	if guest.Token == "" {
		guest.Token = utils.GenerateToken(12)
	}
	if guest.Status == "" {
		guest.Status = "pending"
	}
	now := time.Now().UTC()
	if guest.CreatedAt.IsZero() {
		guest.CreatedAt = now
	}
	if guest.UpdatedAt.IsZero() {
		guest.UpdatedAt = now
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, `
		INSERT INTO guests (
			id, event_id, name, personal_greeting, count, side, category, status,
			phone, email, token, is_vip, is_elder, has_children, assigned_stage_ids,
			comment, responded_at, opened_at, family_group_id, created_at, updated_at
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
		guest.ID, guest.EventID, guest.Name, guest.PersonalGreeting, guest.Count,
		guest.Side, guest.Category, guest.Status,
		guest.Phone, guest.Email, guest.Token,
		guest.IsVip, guest.IsElder, guest.HasChildren, pq.Array(guest.AssignedStageIDs),
		guest.Comment, guest.RespondedAt, guest.OpenedAt, guest.FamilyGroupID,
		guest.CreatedAt, guest.UpdatedAt,
	)
	return err
}

func (r *repo) GetByID(id string) (*Guest, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	row := r.db.QueryRow(ctx,
		"SELECT "+guestColumns+" FROM guests WHERE id=$1", id)
	g, err := scanGuest(row)
	if err != nil {
		if strings.Contains(err.Error(), "no rows") {
			return nil, nil
		}
		return nil, err
	}
	return g, nil
}

func (r *repo) GetByToken(token string) (*Guest, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	row := r.db.QueryRow(ctx,
		"SELECT "+guestColumns+" FROM guests WHERE token=$1", token)
	g, err := scanGuest(row)
	if err != nil {
		if strings.Contains(err.Error(), "no rows") {
			return nil, nil
		}
		return nil, err
	}
	return g, nil
}

func (r *repo) ListByEventID(eventID string) ([]Guest, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	rows, err := r.db.Query(ctx,
		"SELECT "+guestColumns+" FROM guests WHERE event_id=$1 ORDER BY created_at DESC", eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := make([]Guest, 0)
	for rows.Next() {
		g, err := scanGuest(rows)
		if err != nil {
			return nil, err
		}
		list = append(list, *g)
	}
	return list, nil
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
	query := fmt.Sprintf("UPDATE guests SET %s WHERE id=$%d", strings.Join(parts, ","), i)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, query, args...)
	return err
}

func (r *repo) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx, "DELETE FROM guests WHERE id=$1", id)
	return err
}

func (r *repo) MarkOpened(token string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err := r.db.Exec(ctx,
		"UPDATE guests SET opened_at=NOW(), updated_at=NOW() WHERE token=$1 AND opened_at IS NULL",
		token)
	return err
}
