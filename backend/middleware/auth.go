package middleware

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secret = []byte("secret-key") //converting bytes to strings
func GenerateJWT(uid uint64) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"uid": uid,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})
	return token.SignedString(secret) //signing the token with secret key
}

//jwt.MapClaims : claims is data stored inside the token
//exp ->expiration time
