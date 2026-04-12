package events

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) Routes() chi.Router {
	r := chi.NewRouter()
	r.Post("/", h.Create)
	r.Get("/", h.List)
	r.Get("/{eventID}", h.GetByID)
	r.Patch("/{eventID}", h.Update)
	r.Post("/{eventID}/publish", h.Publish)
	r.Post("/{eventID}/unpublish", h.Unpublish)
	r.Get("/{eventID}/stats", h.GetStats)
	return r
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	events, err := h.service.List()
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, events)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var input CreateEventInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	event, err := h.service.Create(input)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, event)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	event, err := h.service.GetByID(eventID)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, event)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	event, err := h.service.Update(eventID, updates)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, event)
}

func (h *Handler) Publish(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	if err := h.service.Publish(eventID); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) Unpublish(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	if err := h.service.Unpublish(eventID); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) GetStats(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	stats, err := h.service.GetStats(eventID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, stats)
}
