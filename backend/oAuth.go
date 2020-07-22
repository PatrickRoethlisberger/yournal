package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/maxzerbini/oauth"
)

func registerAPI(router *gin.Engine) {
	s := oauth.NewOAuthBearerServer(
		secret,
		time.Second*120,
		&TestUserVerifier{},
		nil)
	router.POST("/auth", s.ClientCredentials)
}

// TestUserVerifier provides user credentials verifier for testing.
type TestUserVerifier struct {
}

// ValidateUser validates username and password returning an error if the user credentials are wrong
func (*TestUserVerifier) ValidateUser(username, password, scope string, req *http.Request) error {
	if username == "user01" && password == "12345" {
		return nil
	}
	return errors.New("Wrong user")
}

// ValidateClient validates clientId and secret returning an error if the client credentials are wrong
func (*TestUserVerifier) ValidateClient(clientID, clientSecret, scope string, req *http.Request) error {
	if clientID == "Apple" && clientSecret == "12345" {
		return nil
	}
	return errors.New("Wrong client")
}

// AddClaims provides additional claims to the token
func (*TestUserVerifier) AddClaims(credential, tokenID, tokenType, scope string) (map[string]string, error) {
	claims := make(map[string]string)
	claims["customerId"] = "1001"
	claims["customerData"] = `{"OrderDate":"2016-12-14","OrderId":"9999"}`
	return claims, nil
}

// StoreTokenId saves the token Id generated for the user
func (*TestUserVerifier) StoreTokenId(credential, tokenId, refreshTokenID, tokenType string) error {
	tokenid = tokenId
	return nil
}

// AddProperties provides additional information to the token response
func (*TestUserVerifier) AddProperties(credential, tokenId, tokenType string, scope string) (map[string]string, error) {
	props := make(map[string]string)
	props["customerName"] = "Gopher"
	props["email"] = "marc.bannier@student.ibz.ch"
	return props, nil
}

// ValidateTokenId validates token Id
func (*TestUserVerifier) ValidateTokenId(credential, tokenId, refreshTokenID, tokenType string) error {
	if tokenid == tokenId {
		return nil
	}
	return errors.New("Failed to store Token")
}

// ValidateCode validates token Id
func (*TestUserVerifier) ValidateCode(clientID, clientSecret, code, redirectURI string, req *http.Request) (string, error) {
	return "", nil
}
