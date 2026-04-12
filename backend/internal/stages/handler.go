package stages

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
	r.Post("/events/{eventID}/stages", h.Create)
	r.Get("/events/{eventID}/stages", h.List)
	r.Patch("/stages/{stageID}", h.Update)
	r.Delete("/stages/{stageID}", h.Delete)
	return r
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var stage Stage
	if err := json.NewDecoder(r.Body).Decode(&stage); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	stage.EventID = chi.URLParam(r, "eventID")

	if err := h.service.Create(&stage); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, stage)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	stages, err := h.service.ListByEventID(eventID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, stages)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	stageID := chi.URLParam(r, "stageID")
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	if err := h.service.Update(stageID, updates); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	stageID := chi.URLParam(r, "stageID")
	if err := h.service.Delete(stageID); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
