package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"

	_ "github.com/bronystylecrazy/sit-iot-workshop/docs"

	"github.com/bronystylecrazy/sit-iot-workshop/internal/auth"
	"github.com/bronystylecrazy/sit-iot-workshop/internal/model"
	"github.com/bronystylecrazy/sit-iot-workshop/internal/task"
	"github.com/bronystylecrazy/sit-iot-workshop/internal/user"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/swagger"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//go:embed all:web/dist
var web embed.FS

// @title           SIT IoT Workshop API
// @version         1.0
// @contact.name   Sirawit Pratoomsuwan
// @host      localhost:3000
// @BasePath  /api
func init() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	viper.SetConfigType("yaml")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	viper.SetDefault("SERVER_ADDR", "0.0.0.0:3000")

}

func main() {

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		viper.GetString("DB_HOST"),
		viper.GetString("DB_USER"),
		viper.GetString("DB_PASSWORD"),
		viper.GetString("DB_DBNAME"),
		viper.GetString("DB_PORT"),
		viper.GetString("DB_SSLMODE"),
		viper.GetString("DB_TIMEZONE"),
	)

	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	if err := DB.AutoMigrate(&model.User{}, &model.Task{}, &model.Step{}, &model.Log{}); err != nil {
		panic(err)
	}

	app := fiber.New(fiber.Config{
		Network: "tcp",
	})

	api := app.Group("/api")

	authHandler := auth.NewHandler(DB)
	taskHandler := task.NewHandler(DB)
	userHandler := user.NewHandler(DB)

	api.Post("/auth/login", authHandler.Login)
	api.Get("/auth/me", authHandler.Me)

	api.Post("/tasks", taskHandler.CreateTask)
	api.Get("/tasks", taskHandler.GetTasks)
	api.Get("/tasks/:task_id/steps", taskHandler.GetStepsByTaskID)

	api.Post("/users", userHandler.CreateUser)
	api.Get("/users", userHandler.GetUsers)
	api.Get("/users/:user_id/steps", userHandler.GetStepsByUserID)
	api.Post("/users/:user_id/steps", userHandler.MarkStepAsDone)
	api.Delete("/users/:user_id/steps", userHandler.MarkAsUndone)

	app.Get("/swagger/*", swagger.HandlerDefault) // default

	// check if web/dist exists
	_, err = os.ReadDir("web/dist")

	if err != nil {
		if err := os.Mkdir("web/dist", 0755); err != nil {
			panic(err)
		}
	}

	f, err := fs.Sub(web, "web/dist")

	if err != nil {
		panic(err)
	}

	app.Use("*", filesystem.New(filesystem.Config{
		Root:         http.FS(f),
		Index:        "index.html",
		Browse:       true,
		NotFoundFile: "index.html",
	}))

	app.Listen(viper.GetString("SERVER_ADDR"))
}
