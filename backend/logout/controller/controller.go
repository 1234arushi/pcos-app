package controller

import (
	"backend/response"

	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	resp := response.Success("logged out", nil)
	c.JSON(200, resp)
}
