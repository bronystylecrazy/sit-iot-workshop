package task

type Task struct {
	ID          int     `json:"id" gorm:"primaryKey"`
	Title       *string `json:"title"`
	Description *string `json:"description"`
} // @name Task

type CreateTaskRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
} // @name CreateTaskRequest
