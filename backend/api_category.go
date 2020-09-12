package main

import (
	"fmt"
	"net/http"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

//DeleteCategory deletes a category by given slug
func DeleteCategory(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Prepare SQL Statemment for post delete
	stmtDelPost, err := db.Prepare("Delete from category where oAuthID = ? and category.slug = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtDelPost.Exec(oAuthID, slug)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back statuscode 200, delete sucessful
		c.String(http.StatusOK, "OK")
	}
}

//GetCategory gets a single category by given slug
func GetCategory(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	var category = Category{}
	errFeedback = nil
	//create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Prepare stastement for getting a specific category
	stmtPostsOut, err := db.Prepare("Select category.slug, category.name from category where category.oAuthID = ? and category.slug = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, slug).Scan(&category.Slug, &category.Name)
	if category.Name == "" {
		errFeedback = append(errFeedback, "Category not found")
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back category
		c.JSON(http.StatusOK, gin.H{
			"category": category,
		})
	}
}

// GetCategories function gets all categories for a user
func GetCategories(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	fmt.Println(tokenClaims)
	errFeedback = nil
	var categories = []Category{}
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Get all categories of a specific user
	stmtPostsOut, err := db.Prepare("Select category.slug, category.name from category where oAuthID = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	rows, err := stmtPostsOut.Query(oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var rowCount int = 0
	//store categories to an object for json output
	for rows.Next() {
		var category Category
		err = rows.Scan(&category.Slug, &category.Name)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		categories = append(categories, category)
		rowCount++
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back list of categories
		c.JSON(http.StatusOK, gin.H{
			"categories":      categories,
			"categoriesCount": rowCount,
		})
	}
}

//CreateCategory creates a new Category and stores it in db
func CreateCategory(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	var input CategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Prepare statement for category insert into database
	stmtPostCreate, err := db.Prepare("Insert into category (name,oauthid) Values (?,?)")
	_, err = stmtPostCreate.Exec(input.Name, oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var category = Category{}
	//get inserted category with slug
	stmtPostsOut, err := db.Prepare("Select category.slug, category.name from category where category.oAuthID = ? and category.name = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, input.Name).Scan(&category.Slug, &category.Name)
	if category.Name == "" {
		errFeedback = append(errFeedback, "Category not found")
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { // give back created category with slug
		c.JSON(http.StatusOK, gin.H{
			"category": category,
		})
	}
}
