package model

import (
	"time"
)

type Step struct {
	ID        *uint      `gorm:"primaryKey" json:"id"`
	UserID    *uint      `json:"user_id"`
	TaskID    *uint      `json:"task_id"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}
