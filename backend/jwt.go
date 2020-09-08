package main

import (
	"encoding/json"
	"fmt"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

//Benutzer Type for UserCredentials in JWT generator
type Benutzer struct {
	UserID string
	Email  string
}

var identityKey = "id"
var (
	oauthStateString = String(10)
)
var authMiddleware, err = jwt.New(&jwt.GinJWTMiddleware{
	Realm:       "Yournal",
	Key:         []byte(secret),
	Timeout:     time.Hour,
	MaxRefresh:  time.Hour,
	IdentityKey: identityKey,
	PayloadFunc: func(data interface{}) jwt.MapClaims {
		if v, ok := data.(*Benutzer); ok {
			return jwt.MapClaims{
				identityKey: v.UserID,
			}
		}
		return jwt.MapClaims{}
	},
	IdentityHandler: func(c *gin.Context) interface{} {
		claims := jwt.ExtractClaims(c)
		return &Benutzer{
			UserID: claims[identityKey].(string),
		}
	},
	Authenticator: func(c *gin.Context) (interface{}, error) {
		var auth Auth
		if err := c.ShouldBindJSON(&auth); err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		content, err := GoogleGetUserInfo(auth.State, auth.Code)
		if err != nil {
			fmt.Println(err.Error())
		}
		var userdata UserData
		if err := json.Unmarshal(content, &userdata); err != nil {
			fmt.Println(err)
		}
		var oAuthType string
		var oAuthID string
		db, ers = CreateDBConnection()
		if ers != nil {
			errFeedback = append(errFeedback, ers.Error())
		}
		defer db.Close()
		if userdata.ID != "" && userdata.Email != "" {

			stmtUserOut, err := db.Prepare("Select oAuthType, oAuthID from user where oAuthID = ?")
			if err != nil {
				return nil, jwt.ErrFailedAuthentication
			}
			stmtUserOut.QueryRow(userdata.ID).Scan(&oAuthType, &oAuthID)
			if oAuthType == "" {
				stmtUserCreate, err := db.Prepare("Insert into user (oAuthID, email, oAuthType, image) VALUES (?,?,?,?)")
				if err != nil {
					return nil, jwt.ErrFailedAuthentication
				}
				_, err = stmtUserCreate.Exec(userdata.ID, userdata.Email, "Google", userdata.Picture)
				if err != nil {
					return nil, jwt.ErrFailedAuthentication
				}
				return &Benutzer{
					UserID: userdata.ID,
					Email:  userdata.Email,
				}, nil
			} else if c.Query("oAuthType") == oAuthType && userdata.ID == oAuthID {
				return &Benutzer{
					UserID: userdata.ID,
					Email:  userdata.Email,
				}, nil
			}
		}
		return nil, jwt.ErrFailedAuthentication
	},
	Authorizator: func(data interface{}, c *gin.Context) bool {
		db, ers = CreateDBConnection()
		if ers != nil {
			errFeedback = append(errFeedback, ers.Error())
		}
		defer db.Close()
		stmtUserOut, err := db.Prepare("Select oAuthID from user where oAuthID = ?")
		if err != nil {
			return false
		}
		var oAuthID string
		stmtUserOut.QueryRow(data.(*Benutzer).UserID).Scan(&oAuthID)
		if oAuthID == data.(*Benutzer).UserID {
			return true
		}
		return false
	},
	Unauthorized: func(c *gin.Context, code int, message string) {
		c.JSON(code, gin.H{
			"code":    code,
			"message": message,
		})
	},
	// TokenLookup is a string in the form of "<source>:<name>" that is used
	// to extract token from the request.
	// Optional. Default value "header:Authorization".
	// Possible values:
	// - "header:<name>"
	// - "query:<name>"
	// - "cookie:<name>"
	// - "param:<name>"
	SendCookie:     true,
	SecureCookie:   false, //non HTTPS dev environments
	CookieHTTPOnly: true,  // JS can't modify
	CookieDomain:   "localhost:8080",
	CookieName:     "jwt", // default jwt
	TokenLookup:    "header: Authorization, query: token, cookie: jwt",
	// TokenLookup: "query:token",
	// TokenLookup: "cookie:token",

	// TokenHeadName is a string in the header. Default value is "Bearer"
	TokenHeadName: "Bearer",

	// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
	TimeFunc: time.Now,
})
