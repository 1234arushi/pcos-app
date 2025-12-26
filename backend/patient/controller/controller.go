package controller

import (
	"backend/patient/process"

	"github.com/gin-gonic/gin"
)

func CreatePatient(c *gin.Context) {
	var (
		patient process.PatientRequest
		data    interface{}
		err     error
	)
	if err = (&patient).ValidateReq(c); err == nil {
		data, err = (&patient).ProcessReq(c)
	}
	if err != nil {
		c.JSON(400, data)
		return
	}
	c.JSON(200, data)

}
