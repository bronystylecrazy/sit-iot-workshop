package auth

type LoginRequest struct {
	SeatCode  *string `json:"seat_code"`
	Firstname *string `json:"firstname"`
	Lastname  *string `json:"lastname"`
} // @name LoginRequest
