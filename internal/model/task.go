package model

import (
	"time"
)

type Task struct {
	ID          *uint      `gorm:"primaryKey" json:"id"`
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}
