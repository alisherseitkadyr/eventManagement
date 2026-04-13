package handler

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"

	"event/internal/events"
	"event/internal/guests"
	"event/internal/invitation"
	"event/internal/rsvp"
	"event/internal/stages"
	"event/internal/templates"
)

func New(
	eventHandler *events.Handler,
	guestHandler *guests.Handler,
	stageHandler *stages.Handler,
	invitationHandler *invitation.Handler,
	rsvpHandler *rsvp.Handler,
	templateHandler *templates.Handler,
) *chi.Mux {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RealIP)
	r.Use(render.SetContentType(render.ContentTypeJSON))
	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc: func(r *http.Request, origin string) bool {
			return strings.HasPrefix(origin, "http://localhost:") ||
				strings.HasPrefix(origin, "http://127.0.0.1:") ||
				strings.HasPrefix(origin, "http://192.168.") ||
				origin == "https://qonaq.kz"
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	r.Mount("/templates", templateHandler.Routes())
	
	r.Mount("/events", eventHandler.Routes())

	// Guest routes registered directly to avoid the "/" mount swallowing all requests
	r.Post("/events/{eventID}/guests", guestHandler.Add)
	r.Get("/events/{eventID}/guests", guestHandler.ListByEvent)
	r.Get("/guests/{guestID}", guestHandler.GetByID)
	r.Patch("/guests/{guestID}", guestHandler.Update)
	r.Delete("/guests/{guestID}", guestHandler.Delete)
	r.Post("/guests/{guestID}/remind", guestHandler.Remind)

	// Register stages routes directly to avoid mounting multiple routers on '/'
	r.Post("/events/{eventID}/stages", stageHandler.Create)
	r.Get("/events/{eventID}/stages", stageHandler.List)
	r.Patch("/stages/{stageID}", stageHandler.Update)
	r.Delete("/stages/{stageID}", stageHandler.Delete)

	// Register rsvp routes directly
	r.Post("/rsvp/{token}", rsvpHandler.Submit)
	r.Get("/rsvp/{token}", rsvpHandler.GetByToken)

	r.Mount("/i", invitationHandler.Routes())

	return r
}
