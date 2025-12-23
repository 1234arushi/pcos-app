package patient

import (
	"backend/patient/controller"

	"github.com/gin-gonic/gin"
)

func LoadServices(r *gin.RouterGroup) {
	patient := r.Group("patient")

	{
		patient.POST("/create/", controller.CreatePatient)

	}

}
