package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewPool creates a pgxpool.Pool connected to the provided DSN.
func NewPool(dsn string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		// fall back to direct connect
		return pgxpool.New(context.Background(), dsn)
	}
	// set some sensible defaults
	cfg.MaxConns = 10
	cfg.MinConns = 1
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, err
	}
	return pool, nil
}

func ClosePool(pool *pgxpool.Pool) {
	if pool != nil {
		pool.Close()
	}
}
