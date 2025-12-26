package login

import (
	"backend/login/controller"

	"github.com/gin-gonic/gin"
)

func LoadServices(r *gin.RouterGroup) {
	v1 := r.Group("v1")
	{
		v1.GET("/verifyEmail", controller.VerifyEmail)
		v1.POST("/signUp/", controller.SignUp)
		v1.POST("/login/", controller.Login)

	}
}
