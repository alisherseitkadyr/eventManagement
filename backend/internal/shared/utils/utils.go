package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"
)

// GenerateToken creates a random URL-safe token
func GenerateToken(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)[:length]
}

// GenerateShortID creates a short unique identifier
func GenerateShortID(prefix string) string {
	return fmt.Sprintf("%s_%s", prefix, GenerateToken(8))
}

// FormatDate returns ISO date string
func FormatDate(t time.Time) string {
	return t.Format("2006-01-02")
}

// FormatTime returns HH:MM string
func FormatTime(t time.Time) string {
	return t.Format("15:04")
}

// GetCountdown calculates days/hours/minutes until a date
func GetCountdown(target time.Time) (days, hours, minutes int) {
	diff := time.Until(target)
	if diff < 0 {
		return 0, 0, 0
	}
	days = int(diff.Hours() / 24)
	hours = int(diff.Hours()) % 24
	minutes = int(diff.Minutes()) % 60
	return
}
