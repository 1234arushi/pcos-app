package main

import (
	"backend/database"
	"backend/database/model"
	"backend/login"
	"backend/patient"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func mountRoutes(r *gin.Engine) {
	route := r.Group("pcos")
	{
		patient.LoadServices(route)
		login.LoadServices(route)
	}
}

func main() {
	if err := database.InitDB(); err != nil {
		panic(err)
	}

	database.GetConn().AutoMigrate(&model.Patient{}) //auto-creates table
	database.GetConn().AutoMigrate(&model.User{})    //auto-creates table
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))
	mountRoutes(r)

	r.Run(":8080") //internally it is doing http.ListenAndServe(":8080", r)

}
