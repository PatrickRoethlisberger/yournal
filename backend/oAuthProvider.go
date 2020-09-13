package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

//ChoseAuthProvider user to give the oAuthInformation to FrontEnd
func ChoseAuthProvider(c *gin.Context) {
	GoogleOauthConfig = &oauth2.Config{
		RedirectURL:  "https://yournal.tk/login",
		ClientID:     os.Getenv("google_id"),
		ClientSecret: os.Getenv("google_pw"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
	//Generate a google oAuth URL for authentication
	url := GoogleOauthConfig.AuthCodeURL(oauthStateString)
	//Give back oAuth methods
	c.JSON(http.StatusOK, gin.H{
		"oAuthMethods": gin.H{"oAuthName": "Google",
			"oAuthLink":  url,
			"oAuthLogo":  "google",
			"oAuthColor": "#4285F4",
		},
		"oAuthMethodCount": 1,
	})
}

//GoogleGetUserInfo gives back the information for the authenticated user for saving them into database
func GoogleGetUserInfo(state string, code string) ([]byte, error) {
	//Check if authentication state is valid from provided url
	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}
	//Get token from google
	token, err := GoogleOauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		return nil, fmt.Errorf("code exchange failed: %s", err.Error())
	}
	//Get userinformation from google with given token
	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}
	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading response body: %s", err.Error())
	}
	return contents, nil
}
