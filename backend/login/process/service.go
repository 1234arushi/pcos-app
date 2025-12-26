package process

import (
	"backend/database"
	"backend/database/model"
	"backend/login/util"
	"backend/response"

	"github.com/gin-gonic/gin"
)

func (user *EmailCheckReq) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	var (
		existing model.User
	)
	if err = dbConn.Where("email = ?", user.Email).First(&existing).Error; err == nil {
		resp = response.Success("email already exists", map[string]bool{"exists": true})

		return
	}
	resp = response.Success("email does not exist", map[string]bool{"exists": false})

	return
}

func (user *SignUpReq) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	var (
		existing   model.User
		hashedPass string
	)
	if err = dbConn.Where("email = ?", user.Email).First(&existing).Error; err == nil {
		resp = response.Failure("email already exists")
		return
	}
	if hashedPass, err = util.HashPassword(user.Password); err != nil {

		resp = response.Failure(err.Error())
		return
	}

	newUser := model.User{
		Name:     user.Name,
		Email:    user.Email,
		Password: hashedPass,
	}

	//creating the user
	if err = dbConn.Create(&newUser).Error; err != nil {
		resp = response.Failure(err.Error())
		return
	}
	resp = response.Success("Account created!", newUser)

	return
}

func (user *LoginReq) ProcessReq(c *gin.Context) (resp response.APIResponse, err error) {
	dbConn := database.GetConn()
	var (
		existing model.User
	)
	if err = dbConn.Where("email = ?", user.Email).First(&existing).Error; err != nil {
		resp = response.Failure("invalid email/password")
		return

	}
	if !util.CheckPassword(existing.Password, user.Password) {
		resp = response.Failure("invalid email/password")
		return

	}
	resp = response.Success("login successfull", nil)

	return
}
