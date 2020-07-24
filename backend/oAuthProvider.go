package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

//ChoseAuthProvider user to give the oAuthInformation to FrontEnd
func ChoseAuthProvider(c *gin.Context) {
	GoogleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:8080/auth",
		ClientID:     "326772098844-0lioass0eklv0rlp6994t8vg27l9gqai.apps.googleusercontent.com",
		ClientSecret: "Trw1GWYXpjreSdgq3YTQMSyP",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
	url := GoogleOauthConfig.AuthCodeURL(oauthStateString)
	c.String(http.StatusOK, url)
}

//GoogleGetUserInfo gives back the information for the authenticated user for saving them into database
func GoogleGetUserInfo(state string, code string) ([]byte, error) {
	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}
	token, err := GoogleOauthConfig.Exchange(oauth2.NoContext, code)
	if err != nil {
		return nil, fmt.Errorf("code exchange failed: %s", err.Error())
	}
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
