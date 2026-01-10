package main

import (
	"backend/database"
	"backend/database/model"
	"backend/login"
	"backend/logout"
	"backend/middleware"
	"backend/patient"
	"os"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func mountRoutes(r *gin.Engine) {
	route := r.Group("pcos")
	{

		login.LoadServices(route)
		route.Use(middleware.AuthMiddleware())
		patient.LoadServices(route)
		logout.LoadServices(route)
	}
}

func main() {
	if err := database.InitDB(); err != nil {
		panic(err)
	}
	frontendURL := os.Getenv("FRONTEND_URL")         //cors : cross origin resource sharing
	database.GetConn().AutoMigrate(&model.Patient{}) //auto-creates table
	database.GetConn().AutoMigrate(&model.User{})
	database.GetConn().AutoMigrate(&model.PcosAnalysis{})
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))
	mountRoutes(r)

	r.Run(":8080") //internally it is doing http.ListenAndServe(":8080", r)

}
