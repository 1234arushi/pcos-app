package controller

import (
	"backend/patient/process"
	"net/http"

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
	c.JSON(http.StatusOK, data)

}
