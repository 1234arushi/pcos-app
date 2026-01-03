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

func ListPatients(c *gin.Context) {
	var (
		p    process.ListPatientReq
		data interface{}
		err  error
	)
	if err = (&p).ValidateReq(c); err == nil {
		data, err = (&p).ProcessReq(c)
	}
	if err != nil {
		c.JSON(400, data)
		return
	}
	c.JSON(200, data)
}

func DoAnalysis(c *gin.Context) {
	var (
		req  process.PcosAnalysisReq
		data interface{}
		err  error
	)
	if err = (&req).ValidateReq(c); err == nil {
		data, err = (&req).ProcessReq(c)

	}
	if err != nil {
		c.JSON(400, data)
		return
	}
	c.JSON(200, data)
}
