package process

import (
	"backend/database"
	"backend/database/model"
	"backend/response"

	"github.com/gin-gonic/gin"
)

func (p *ListPatientReq) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	var (
		patients []model.Patient
	)
	if err = dbConn.Model(&model.Patient{}).Where("fk_user_id = ?", p.UserID).Find(&patients).Error; err != nil {
		resp = response.Failure(err.Error())
		return

	}
	resp = response.Success("patients fetched successfully", patients)

	return
}

func (patient *PatientRequest) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	p := map[string]interface{}{
		"Name":     patient.Name,
		"Age":      patient.Age,
		"Phone":    patient.Phone,
		"Email":    patient.Email,
		"FkUserID": &patient.FkUserID,
	}

	if err = dbConn.Model(&model.Patient{}).Create(p).Error; err != nil {
		resp = response.Failure(err.Error())
		return

	}
	resp = response.Success("patient created successfully", patient)

	return
}
