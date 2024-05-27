package model

import (
	"time"
)

type User struct {
	ID        *uint      `gorm:"primaryKey" json:"id"`
	Seat      *string    `json:"seat"`
	Firstname *string    `json:"firstname"`
	Lastname  *string    `json:"lastname"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
