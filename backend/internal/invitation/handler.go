package invitation

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

type Handler struct {
	service Service
	appURL  string
}

func NewHandler(s Service, appURL string) *Handler {
	return &Handler{service: s, appURL: appURL}
}

func (h *Handler) Routes() chi.Router {
	r := chi.NewRouter()
	r.Get("/{token}", h.GetInvitation)
	r.Post("/{token}/opened", h.MarkOpened)
	return r
}

func (h *Handler) GetInvitation(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")

	payload, err := h.service.GetByToken(token)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	render.JSON(w, r, map[string]interface{}{
		"event":         payload.Event,
		"guest":         payload.Guest,
		"visibleStages": payload.VisibleStages,
		"response":      payload.Response,
		"invitationUrl": h.service.BuildInvitationURL(h.appURL, token),
	})
}

func (h *Handler) MarkOpened(w http.ResponseWriter, r *http.Request) {
	token := chi.URLParam(r, "token")
	if err := h.service.MarkOpened(token); err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
}
