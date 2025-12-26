package process

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func (e *EmailCheckReq) ValidateReq(c *gin.Context) (err error) {
	if err = c.ShouldBindQuery(&e); err != nil {
		return fmt.Errorf("invalid email query param : %w", err)
	}

	return
}

func (u *SignUpReq) ValidateReq(c *gin.Context) (err error) {
	if err = c.ShouldBindJSON(&u); err != nil {
		return fmt.Errorf("invalid request body : %w", err)
	}

	return
}

func (u *LoginReq) ValidateReq(c *gin.Context) (err error) {
	if err = c.ShouldBindJSON(&u); err != nil {
		return fmt.Errorf("invalid request body : %w", err)
	}

	return
}
