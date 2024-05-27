package user

import "time"

type User struct {
	ID        uint       `json:"id" validate:"required"`
	Seat      *string    `validate:"required" json:"seat"`
	Firstname *string    `validate:"required" json:"firstname"`
	Lastname  *string    `validate:"required" json:"lastname"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
} // @name User

type CreateUserRequest struct {
	Seat      *string `json:"seat" validate:"required"`
	Firstname *string `json:"firstname" validate:"required"`
	Lastname  *string `json:"lastname" validate:"required"`
} // @name CreateUserRequest
