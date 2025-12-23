package main

import (
	"backend/database"
	"backend/database/model"
	"backend/patient"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func mountRoutes(r *gin.Engine) {
	route := r.Group("pcos")
	{
		patient.LoadServices(route)
	}
}

func main() {
	if err := database.InitDB(); err != nil {
		panic(err)
	}

	database.GetConn().AutoMigrate(&model.Patient{}) //auto-creates table
	r := gin.Default()
	mountRoutes(r)

	fmt.Println("PCOS backend starting on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("server error:", err)
	}
}
