package patient

import (
	"backend/patient/controller"

	"github.com/gin-gonic/gin"
)

func LoadServices(r *gin.RouterGroup) {
	patient := r.Group("patient")

	{
		patient.GET("/list/", controller.ListPatients)
		patient.POST("/create/", controller.CreatePatient)

	}

}
