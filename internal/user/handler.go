package user

import (
	"github.com/bronystylecrazy/sit-iot-workshop/internal/model"
	"github.com/gofiber/fiber/v2"
)

// CreateUser
// @Summary Create a new user
// @Tags user
// @Id createUser
// @Accept json
// @Produce json
// @Param user body CreateUserRequest true "User"
// @Success 201 {string} string "Created"
// @Router /users [post]
func (u *Handler) CreateUser(c *fiber.Ctx) error {
	form := new(CreateUserRequest)

	if err := c.BodyParser(form); err != nil {
		return err
	}

	user := model.User{
		Firstname: form.Firstname,
		Lastname:  form.Lastname,
		Seat:      form.Seat,
	}

	return u.DB.Create(&user).Error
}

// GetUsers
// @Summary Get all users
// @Tags user
// @Id getUsers
// @Produce json
// @Success 200 {array} User
// @Router /users [get]
func (u *Handler) GetUsers(c *fiber.Ctx) error {
	var users []model.User

	if err := u.DB.Find(&users).Error; err != nil {
		return err
	}

	return c.JSON(users)
}

// GetStepsByUserID
// @Summary Get steps by user ID
// @Tags user
// @Id getStepsByUserID
// @Produce json
// @Param user_id path int true "User ID"
// @Success 200 {array} model.Step
// @Router /users/{user_id}/steps [get]
func (u *Handler) GetStepsByUserID(c *fiber.Ctx) error {
	userID := c.Params("user_id")

	var steps []model.Step

	if err := u.DB.Where("user_id = ?", userID).Find(&steps).Error; err != nil {
		return err
	}

	return c.JSON(steps)
}

// MarkStepAsDone
// @Summary Mark step as done
// @Tags user
// @Id markStepAsDone
// @Produce json
// @Param user_id path int true "User ID"
// @Param task_id query int true "Task ID"
// @Success 200 {string} string "OK"
// @Success 201 {string} string "Created"
// @Router /users/{user_id}/steps [post]
func (u *Handler) MarkStepAsDone(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("user_id")

	if err != nil {
		return err
	}
	uid := uint(userID)
	stepID := uint(c.QueryInt("task_id", 0))

	var step *model.Step

	if err := u.DB.Where("task_id = ?", stepID).Where("user_id = ?", userID).First(&step).Error; err != nil {
		if err := u.DB.Create(&model.Step{
			TaskID: &stepID,
			UserID: &uid,
		}).Error; err != nil {
			return err
		}
		return c.SendStatus(fiber.StatusCreated)
	}

	return c.SendStatus(fiber.StatusOK)
}

// MarkAsUndone
// @Summary Mark step as undone
// @Tags user
// @Id markAsUndone
// @Produce json
// @Param user_id path int true "User ID"
// @Param task_id query int true "Task ID"
// @Success 200 {string} string "OK"
// @Router /users/{user_id}/steps [delete]
func (u *Handler) MarkAsUndone(c *fiber.Ctx) error {
	userID, err := c.ParamsInt("user_id")

	if err != nil {
		return err
	}
	uid := uint(userID)
	stepID := uint(c.QueryInt("task_id", 0))

	if err := u.DB.Where(&model.Step{
		TaskID: &stepID,
		UserID: &uid,
	}).Delete(&model.Step{}).Error; err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusOK)
}
