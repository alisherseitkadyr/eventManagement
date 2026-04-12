package handler

import (
	"context"
	"net/http"
	"strings"

	"event/internal/config"
	"event/internal/shared/errors"
	"github.com/go-chi/render"
)

type contextKey string

const UserIDKey contextKey = "userID"

// Simple auth middleware (JWT placeholder)
func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				// For MVP, allow all requests without auth
				// You can add proper JWT validation later
				next.ServeHTTP(w, r)
				return
			}

			token := strings.TrimPrefix(authHeader, "Bearer ")
			// Validate token (mock)
			if token != "mock-token" {
				render.Status(r, http.StatusUnauthorized)
				render.JSON(w, r, errors.NewNotFound("invalid token"))
				return
			}

			// Set user ID in context
			ctx := context.WithValue(r.Context(), UserIDKey, "user_001")
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserID extracts user ID from context
func GetUserID(r *http.Request) (string, bool) {
	id, ok := r.Context().Value(UserIDKey).(string)
	return id, ok
}
