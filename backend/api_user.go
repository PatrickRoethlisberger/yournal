package main

import (
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

// GetCurrentUser - Get current user
func GetCurrentUser(c *gin.Context) {

	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)

	var user, err = GetUserInformation(oAuthID)
	errorMessage := err.Error()
	if err != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errorMessage},
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})
	}
}

// UpdateCurrentUser - Update current user
func UpdateCurrentUser(c *gin.Context) {
	type UserInput struct {
		Username string `json:"username"`
		Image    string `json:"image"`
	}
	var input UserInput
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	errFeedback = nil
	if err = c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, "failed to bind JSON")
	}
	if input.Username == "" && input.Image == "" {
		errFeedback = append(errFeedback, "no input provided")
	}
	db = CreateDBConnection()
	defer db.Close()
	if input.Username != "" {
		stmtUserUpdate, err := db.Prepare("update user set username = ? where oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, "Failed to attach new username")
		}
		_, err = stmtUserUpdate.Exec(input.Username, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, "Failed to attach new username")
		}
	}
	if input.Image != "" {
		stmtUserUpdate, err := db.Prepare("update user set image = ? where oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, "Failed to attach new image")
		}
		_, err = stmtUserUpdate.Exec(input.Image, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, "Failed to attach new image")
		}
	}
	var user, err = GetUserInformation(oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, "Failed to get User properties")
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})
	}
}
