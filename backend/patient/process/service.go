package process

import (
	"backend/database"
	"backend/database/model"
	"backend/response"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

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

func (req *PcosAnalysisReq) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	var (
		mlresp   response.MLResp
		httpResp *http.Response
	)
	dbConn := database.GetConn()
	mlURL := os.Getenv("ML_SERVICE_URL")
	if mlURL == "" {
		// local docker-compose fallback
		mlURL = "http://ml-service:8005"
	}
	pythonURL := mlURL + "/predict"

	//converting map into JSON for python
	symptomBytes, _ := json.Marshal(req.Symptoms)
	httpResp, err = http.Post(
		pythonURL,
		"application/json",
		bytes.NewBuffer(symptomBytes),
	)
	if err != nil {
		resp = response.Failure(err.Error())
		return

	}
	defer httpResp.Body.Close()
	//reading python response
	if httpResp.StatusCode != http.StatusOK {
		//this is required when fastAPI gives error,it's format is in HTML
		body, _ := io.ReadAll(httpResp.Body)
		resp = response.Failure(
			fmt.Sprintf("ML error %d: %s", httpResp.StatusCode, string(body)),
		)
		return
	}
	if err = json.NewDecoder(httpResp.Body).Decode(&mlresp); err != nil {
		resp = response.Failure(err.Error())
		return

	}

	record := model.PcosAnalysis{
		FkPatientID: &req.PatientID,
		InputJson:   symptomBytes,
		Probability: &mlresp.Probability,
		RiskLabel:   &mlresp.RiskLabel,
		FkUserID:    &req.UserID,
	}
	if err = dbConn.Create(&record).Error; err != nil {
		resp = response.Failure(err.Error())
		return

	}
	resp = response.Success("Analysis Saved.", gin.H{
		"id":          record.ID,
		"probability": mlresp.Probability,
		"risk_label":  mlresp.RiskLabel,
	})

	return
}
