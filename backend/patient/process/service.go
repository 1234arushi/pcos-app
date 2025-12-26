package process

import (
	"backend/database"
	"backend/database/model"
	"backend/response"

	"github.com/gin-gonic/gin"
)

func (patient *PatientRequest) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	// var (
	// 	p mapper.PatientResp
	// )
	if err = dbConn.Model(&model.Patient{}).Create(&patient).Error; err != nil {
		resp = response.Failure(err.Error())
		return

	}
	resp = response.Success("patient created successfully", patient)

	return
}
