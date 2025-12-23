package process

import (
	"backend/database"
	"backend/database/model"

	"backend/patient/mapper"

	"github.com/gin-gonic/gin"
)

func (patient *PatientRequest) ProcessReq(c *gin.Context) (resp *mapper.PatientResp, err error) {
	dbConn := database.GetConn()

	if err = dbConn.Model(&model.Patient{}).Create(&resp).Error; err != nil {
		return nil, err
	}

	return
}
