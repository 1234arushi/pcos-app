package process

import (
	"backend/middleware"
	"fmt"

	"github.com/gin-gonic/gin"
)

func (patient *PatientRequest) ValidateReq(c *gin.Context) (err error) {
	if err = c.ShouldBindJSON(&patient); err != nil {
		return fmt.Errorf("invalid request body : %w", err)
	}

	return
}

func (reqModel *ListPatientReq) ValidateReq(c *gin.Context) (err error) {
	reqModel.UserID = middleware.GetUserFromContext(c)
	return
}
