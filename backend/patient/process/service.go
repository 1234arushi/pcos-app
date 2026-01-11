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
	"time"

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
		mlURL = "http://ml-service:8005"
	}
	pythonURL := mlURL + "/predict"

	// marshal payload
	symptomBytes, err := json.Marshal(req.Symptoms)
	if err != nil {
		resp = response.Failure("invalid input payload")
		return
	}

	// HTTP client with timeout
	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	// retry loop
	for attempt := 1; attempt <= 3; attempt++ {
		httpResp, err = client.Post(
			pythonURL,
			"application/json",
			bytes.NewBuffer(symptomBytes),
		)

		if err == nil && httpResp.StatusCode == http.StatusOK {
			break
		}

		if httpResp != nil {
			body, _ := io.ReadAll(httpResp.Body)
			fmt.Println(
				"ML attempt", attempt,
				"failed:", httpResp.StatusCode,
				string(body),
			)
			httpResp.Body.Close() //one attempt request done,now close its response
		}

		time.Sleep(time.Duration(attempt*2) * time.Second)
	}

	// after retries
	if httpResp == nil || httpResp.StatusCode != http.StatusOK {
		resp = response.Failure(
			"ML service is waking up. Please try again in a few seconds.",
		)
		return
	}
	defer httpResp.Body.Close()

	// decode JSON
	if err = json.NewDecoder(httpResp.Body).Decode(&mlresp); err != nil {
		resp = response.Failure("invalid ML response")
		return
	}

	// save result
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
