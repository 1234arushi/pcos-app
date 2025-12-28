package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// when writing middleware,you don't directly pass data.
// you pass a function that gin will call later
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) { //a func that receives gin context and returns nothing
		//reading the token
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing auth token"}) //gin.H is a shortcut for map[string]interface{}
			return                                                                               //just added to make JSON responses easier to read

		}
		//verify token & decode
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return SecretKey, nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid auth token"})
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		uid := claims["uid"]
		c.Set("uid", uid)
		c.Next() //token check done,now allow request to proceed

	}
}
