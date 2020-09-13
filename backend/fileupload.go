package main

import (
	"encoding/hex"
	"math/rand"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

//FileUpload uploads a file to the webserver and gives back the path
func FileUpload(c *gin.Context) {

	//Get informations from Request
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": err.Error()},
		})
		return
	}
	//filename gives the new filename as randomized string
	filename := UniqueFileName(filepath.Ext(file.Filename))

	//localpath defines the local store in which the file is saved
	localpath := filepath.Join("/var/www/tk/yournal/", filename)

	//webpath defines the webaccessible path for the yournal
	webpath := "assets.yournal.tk/" + filename

	//Saving the uploaded file to the local path
	if err := c.SaveUploadedFile(file, localpath); err != nil {
		//Give back the error message from fileupload
		c.JSON(422, gin.H{
			"errors": gin.H{"body": err},
		})
		return
	} // Give back the webpath for storing into database
	c.JSON(http.StatusOK, gin.H{
		"filepath": webpath,
	})
}

//UniqueFileName creates a random filename for unique usage
func UniqueFileName(suffix string) string {
	randBytes := make([]byte, 16)
	rand.Read(randBytes)
	return (hex.EncodeToString(randBytes) + suffix)
}
