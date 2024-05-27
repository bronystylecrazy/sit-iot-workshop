package auth

import (
	"strings"

	"github.com/bronystylecrazy/sit-iot-workshop/internal/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(DB *gorm.DB) *Handler {
	return &Handler{
		DB: DB,
	}
}

// Login
// @Summary Login
// @Tags auth
// @Id login
// @Accept json
// @Produce json
// @Param user body LoginRequest true "User"
// @Success 200 {object} model.User
// @Router /auth/login [post]
func (a *Handler) Login(c *fiber.Ctx) error {
	form := new(LoginRequest)

	if err := c.BodyParser(form); err != nil {
		return err
	}

	if form.SeatCode == nil {
		return fiber.NewError(fiber.StatusBadRequest, "Seat code is required")
	}

	formatizedSeat := strings.TrimSpace(strings.ToUpper(*form.SeatCode))

	user := &model.User{
		Seat:      &formatizedSeat,
		Firstname: form.Firstname,
		Lastname:  form.Lastname,
	}

	foundUser := &model.User{}

	if err := a.DB.Where(&model.User{
		Seat: &formatizedSeat,
	}).First(&foundUser).Error; err != nil {
		if err := a.DB.Clauses(&clause.Returning{}).Create(&user).Error; err != nil {
			return err
		}
		return c.JSON(user)
	}

	if err := a.DB.Model(&foundUser).Updates(&model.User{
		Firstname: form.Firstname,
		Lastname:  form.Lastname,
	}).Error; err != nil {
		return err
	}

	return c.JSON(user)
}

// Me
// @Summary Get current user
// @Tags auth
// @Id me
// @Produce json
// @Param seat_code query string true "Seat code"
// @Success 200 {object} model.User
// @Router /auth/me [get]
func (a *Handler) Me(c *fiber.Ctx) error {
	seat := c.Query("seat_code")

	user := &model.User{}

	if err := a.DB.Where(&model.User{
		Seat: &seat,
	}).First(&user).Error; err != nil {
		return err
	}

	return c.JSON(user)
}
