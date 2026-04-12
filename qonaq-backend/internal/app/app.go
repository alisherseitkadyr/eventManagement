package app

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"

	"event/internal/config"
	"event/internal/events"
	"event/internal/guests"
	"event/internal/invitation"
	"event/internal/rsvp"
	"event/internal/shared/db"
	"event/internal/shared/handler"
	"event/internal/stages"
)

type App struct {
	server *http.Server
	db     *pgxpool.Pool
	config *config.Config
}

func New() (*App, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}

	pool, err := db.NewPool(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}

	// Wait for DB to be ready (ping) before proceeding to repositories/seed
	ready := false
	for i := 0; i < 20; i++ {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		if err := pool.Ping(ctx); err == nil {
			cancel()
			ready = true
			break
		}
		cancel()
		time.Sleep(500 * time.Millisecond)
	}
	if !ready {
		return nil, fmt.Errorf("database not ready after retries")
	}

	// Initialize repositories
	eventRepo := events.NewRepository(pool)
	guestRepo := guests.NewRepository(pool)
	stageRepo := stages.NewRepository(pool)

	// Initialize services
	eventService := events.NewService(eventRepo, stageRepo, guestStatsAdapter{repo: guestRepo})
	guestService := guests.NewService(guestRepo, eventValidatorAdapter{repo: eventRepo})
	stageService := stages.NewService(stageRepo)
	rsvpService := rsvp.NewService(guestRepo)

	if err := seedDemoData(eventRepo, guestRepo, stageRepo); err != nil {
		return nil, fmt.Errorf("seed demo data: %w", err)
	}

	// Initialize handlers
	eventHandler := events.NewHandler(eventService)
	guestHandler := guests.NewHandler(guestService)
	stageHandler := stages.NewHandler(stageService)
	invitationService := invitation.NewService(eventService, guestService, rsvpService)
	invitationHandler := invitation.NewHandler(invitationService, cfg.AppURL)
	rsvpHandler := rsvp.NewHandler(rsvpService)

	r := handler.New(eventHandler, guestHandler, stageHandler, invitationHandler, rsvpHandler)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return &App{
		server: server,
		db:     pool,
		config: cfg,
	}, nil
}

func (a *App) Start() error {
	log.Info().Str("port", a.config.Port).Msg("Starting server")
	return a.server.ListenAndServe()
}

func (a *App) Shutdown(ctx context.Context) error {
	return a.server.Shutdown(ctx)
}

type guestStatsAdapter struct {
	repo guests.Repository
}

func (a guestStatsAdapter) ListByEventID(eventID string) ([]events.GuestForStats, error) {
	list, err := a.repo.ListByEventID(eventID)
	if err != nil {
		return nil, err
	}

	result := make([]events.GuestForStats, 0, len(list))
	for _, guest := range list {
		result = append(result, events.GuestForStats{
			Count:  guest.Count,
			Status: guest.Status,
		})
	}

	return result, nil
}

type eventValidatorAdapter struct {
	repo events.Repository
}

func (a eventValidatorAdapter) GetByID(id string) (*guests.EventInfo, error) {
	event, err := a.repo.GetByID(id)
	if err != nil || event == nil {
		return nil, err
	}

	return &guests.EventInfo{ID: event.ID}, nil
}
