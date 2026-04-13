package errors

import "errors"

var (
	ErrNotFound     = errors.New("resource not found")
	ErrInvalidInput = errors.New("invalid input")
	ErrUnauthorized = errors.New("unauthorized")
	ErrInternal     = errors.New("internal server error")
	ErrConflict     = errors.New("resource already exists")
)

type APIError struct {
	Status  int    `json:"-"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e *APIError) Error() string {
	return e.Message
}

func NewNotFound(message string) *APIError {
	return &APIError{Status: 404, Code: "NOT_FOUND", Message: message}
}

func NewBadRequest(message string) *APIError {
	return &APIError{Status: 400, Code: "BAD_REQUEST", Message: message}
}

func NewInternal(message string) *APIError {
	return &APIError{Status: 500, Code: "INTERNAL_ERROR", Message: message}
}
