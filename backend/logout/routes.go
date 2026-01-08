package logout

import (
	"backend/logout/controller"

	"github.com/gin-gonic/gin"
)

func LoadServices(r *gin.RouterGroup) {
	v1 := r.Group("v1")
	{

		v1.GET("/logout/", controller.Logout)

	}
}
