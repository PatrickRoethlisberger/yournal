/*
 * Yournal API
 *
 * Documentation and definition of the Yournal API  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
 *
 * API version: 0.1.0
 * Contact: hi@yournal.tk
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DeletePost - Delete a post
func DeletePost(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{})
}

// GetPost - Get a post
func GetPost(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{})
}

// GetPosts - Get posts
func GetPosts(c *gin.Context) {
	//claims := jwt.ExtractClaims(c)
	//user, _ := c.Get(identityKey)
	c.JSON(http.StatusOK, gin.H{
		"slug":       "teststring",
		"title":      "Dies ist ein Testeintrag",
		"coverImage": "https://source.unsplash.com/random",
		"body":       "Dieser Beispieltext soll das JSON testen",
		"createdAt":  "2020-07-20 16:35",
		"updatedAt":  "2020-07-20 17:00",
		"author":     "Marc Bannier"})
}

// UpdatePost - Update a post
func UpdatePost(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{})
}
