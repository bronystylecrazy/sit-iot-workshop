package task

import (
	"github.com/bronystylecrazy/sit-iot-workshop/internal/model"
	"github.com/gofiber/fiber/v2"
)

// CreateTask
// @Summary Create a new task
// @Tags task
// @Id createTask
// @Accept json
// @Produce json
// @Param task body CreateTaskRequest true "Task"
// @Success 201 {string} string "Created"
// @Router /tasks [post]
func (t *Handler) CreateTask(c *fiber.Ctx) error {

	form := new(CreateTaskRequest)

	if err := c.BodyParser(form); err != nil {
		return err
	}

	task := model.Task{
		Title:       form.Title,
		Description: form.Description,
	}

	return t.DB.Create(&task).Error
}

// GetTasks
// @Summary Get all tasks
// @Tags task
// @Id getTasks
// @Produce json
// @Success 200 {array} Task
// @Router /tasks [get]
func (t *Handler) GetTasks(c *fiber.Ctx) error {
	var tasks []model.Task

	if err := t.DB.Find(&tasks).Error; err != nil {
		return err
	}

	return c.JSON(tasks)
}

// GetStepsByTaskID
// @Summary Get steps by task ID
// @Tags user
// @Id getStepsByTaskID
// @Produce json
// @Param task_id path int true "Task ID"
// @Success 200 {array} model.Step
// @Router /tasks/{task_id}/steps [get]
func (u *Handler) GetStepsByTaskID(c *fiber.Ctx) error {
	taskID, err := c.ParamsInt("task_id")

	if err != nil {
		return err
	}

	var steps []model.Step

	if err := u.DB.Where("task_id = ?", taskID).Find(&steps).Error; err != nil {
		return err
	}

	return c.JSON(steps)
}
