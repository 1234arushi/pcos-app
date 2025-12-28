package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var SecretKey = []byte("secret-key") //converting bytes to strings
func GenerateJWT(uid uint64) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"uid": uid,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})
	return token.SignedString(SecretKey) //signing the token with secret key
}

//jwt.MapClaims : claims is data stored inside the token
//exp ->expiration time

func GetUserFromContext(c *gin.Context) (id uint64) {
	uid, ok := c.Get("uid")
	if !ok {
		return
	}
	id = uint64(uid.(float64)) //claims["uid"] is interface{},when it stores number by default it become float,hence we are asserting that here and then typecasting
	return
}
