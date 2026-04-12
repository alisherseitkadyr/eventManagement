package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	AppURL      string
	JWTSecret   string
}

func Load() (*Config, error) {
	_ = godotenv.Load() // ignore error if .env missing

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_DSN")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@postgres:5432/qonaq?sslmode=disable"
	}

	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:3000"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-key"
	}

	return &Config{
		Port:        port,
		DatabaseURL: dbURL,
		AppURL:      appURL,
		JWTSecret:   jwtSecret,
	}, nil
}

func (c *Config) ConnectionString() string {
	return c.DatabaseURL
}
