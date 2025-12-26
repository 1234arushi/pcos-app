package controller

import (
	"backend/login/process"
	"backend/response"

	"github.com/gin-gonic/gin"
)

func VerifyEmail(c *gin.Context) {
	var (
		userEmail process.EmailCheckReq
		data      response.APIResponse
		err       error
	)
	if err = (&userEmail).ValidateReq(c); err == nil {
		data, err = (&userEmail).ProcessReq(c)
	}
	// if err != nil {
	// 	c.JSON(400, data)
	// 	return

	// }
	c.JSON(200, data)
}

func SignUp(c *gin.Context) {
	var (
		user process.SignUpReq
		data response.APIResponse
		err  error
	)
	if err = (&user).ValidateReq(c); err == nil {
		data, err = (&user).ProcessReq(c)
	}
	if err != nil {
		c.JSON(400, data)
		return

	}
	c.JSON(200, data)
}

func Login(c *gin.Context) {
	var (
		user process.LoginReq
		data response.APIResponse
		err  error
	)
	if err = (&user).ValidateReq(c); err == nil {
		data, err = (&user).ProcessReq(c)
	}
	if err != nil {
		c.JSON(400, data)
		return

	}
	c.JSON(200, data)
}
