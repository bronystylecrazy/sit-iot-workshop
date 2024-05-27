package model

import (
	"time"
)

type Log struct {
	ID        *uint      `gorm:"primaryKey" json:"id"`
	UserID    *int       `json:"user_id"`
	TaskID    *int       `json:"task_id"`
	Pass      *bool      `json:"pass"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
