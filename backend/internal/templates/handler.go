package templates

import (
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
	fs := http.FileServer(http.Dir("./frontend"))
	r.Handle("/*", fs)
	r.Get("/", h.List)
	r.Get("/{templateID}", h.GetByID)
	return r
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	templates, err := h.service.List()
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}
	render.JSON(w, r, templates)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	templateID := chi.URLParam(r, "templateID")
	template, err := h.service.GetByID(templateID)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "template not found"})
		return
	}
	render.JSON(w, r, template)
}
