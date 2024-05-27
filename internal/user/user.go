package user

import "gorm.io/gorm"

type Handler struct {
	DB *gorm.DB
}

func NewHandler(DB *gorm.DB) *Handler {
	return &Handler{
		DB: DB,
	}
}
