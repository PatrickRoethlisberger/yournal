package main

import (
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

// GetCurrentUser - Get current user
func GetCurrentUser(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	//Get user information by given oAuthID
	var user, err = GetUserInformation(oAuthID)
	errorMessage := err.Error()
	//Give back error from getting user information
	if err != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errorMessage},
		})
	} else { //Give back current user
		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})
	}
}

// UpdateCurrentUser - Update current user
func UpdateCurrentUser(c *gin.Context) {
	var input UserInput
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	//Reset Errorfeedback
	errFeedback = nil
	//Bind information from request JSON to object
	if err = c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, "failed to bind JSON")
	}
	if input.Username == "" && input.Image == "" {
		errFeedback = append(errFeedback, "no input provided")
	}
	//Create database connection
	db, err = CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//If username is set in request, update in database
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
	//If user image should be updated, store new image path in database
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
	//Get new user informations from database
	var user, err = GetUserInformation(oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, "Failed to get User properties")
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back updated user informations
		c.JSON(http.StatusOK, gin.H{
			"user": user,
		})
	}
}
