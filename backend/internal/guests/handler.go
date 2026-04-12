package guests

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
	r.Post("/events/{eventID}/guests", h.Add)
	r.Get("/events/{eventID}/guests", h.ListByEvent)
	r.Get("/guests/{guestID}", h.GetByID)
	r.Patch("/guests/{guestID}", h.Update)
	r.Delete("/guests/{guestID}", h.Delete)
	r.Post("/guests/{guestID}/remind", h.Remind)
	return r
}

func (h *Handler) Add(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	var input AddGuestInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	guest, err := h.service.Add(eventID, input)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	render.Status(r, http.StatusCreated)
	render.JSON(w, r, guest)
}

func (h *Handler) ListByEvent(w http.ResponseWriter, r *http.Request) {
	eventID := chi.URLParam(r, "eventID")
	guests, err := h.service.ListByEventID(eventID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, guests)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	guestID := chi.URLParam(r, "guestID")
	guest, err := h.service.GetByID(guestID)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, guest)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	guestID := chi.URLParam(r, "guestID")
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	guest, err := h.service.Update(guestID, updates)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, guest)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	guestID := chi.URLParam(r, "guestID")
	if err := h.service.Delete(guestID); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Remind(w http.ResponseWriter, r *http.Request) {
	// Placeholder: implement notification logic
	w.WriteHeader(http.StatusOK)
}
