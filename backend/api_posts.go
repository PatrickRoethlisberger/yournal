package main

import (
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

// DeletePost deletes a post on a given slug
func DeletePost(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	//Reset Errorfeedback
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Prepare statement for post delete
	stmtDelPost, err := db.Prepare("Delete from post where oAuthID = ? and post.slug = ?")
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

// GetPost gets a single Post by given slug
func GetPost(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	var post = Post{}
	//Reset Errorfeedback
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Prepare statement for getting single post from database
	stmtPostsOut, err := db.Prepare("Select post.slug, category.name, post.title, post.coverImage, post.body, post.createdAt, post.updatedAt, post.pubDate, post.isprivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category where user.oAuthID = ? and post.slug = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, slug).Scan(&post.Slug, &post.Category, &post.Title, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)
	//Control if post is not found
	if post.Title == "" {
		errFeedback = append(errFeedback, "Post not found")
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back single post
		c.JSON(http.StatusOK, gin.H{
			"post": post,
		})
	}
}

// GetPosts function gets all posts on a given filter
func GetPosts(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	//Reset Errorfeedback
	errFeedback = nil
	var whereClause string
	var query Query
	//Get information from query parameter
	query.limit, _ = c.GetQuery("limit")
	query.author, _ = c.GetQuery("author")
	query.offset, _ = c.GetQuery("offset")
	pubDateTotemp, _ := c.GetQuery("pubDateTo")
	PubDateFromtemp, _ := c.GetQuery("pubDateFrom")
	query.PubDateFrom, _ = time.Parse(time.RFC3339, PubDateFromtemp)
	query.PubDateTo, _ = time.Parse(time.RFC3339, pubDateTotemp)
	query.category, _ = c.GetQuery("category")
	//Define limit and offset for select statement, user limit = 1000000, offset = 0 as default
	if query.limit == "" {
		query.limit = "1000000"
	}
	if query.offset == "" {
		query.offset = "0"
	}
	//Control if author is queried, else show posts from current user
	if query.author != "" {
		var user, err = GetUserInformation(oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		if query.author == user.Username {
			whereClause = "where user.username ='" + query.author + "'"
		} else {
			whereClause = "where (user.username ='" + query.author + "' and post.isPrivate = 0)"
		}
	} else {
		whereClause = "where (user.oAuthID ='" + oAuthID + "' or post.isPrivate = 0)"
	}
	//Expand where clause with information about publication date
	if query.PubDateFrom.IsZero() && query.PubDateTo.IsZero() {
		whereClause += " and post.pubDate >= '" + query.PubDateFrom.Format(time.RFC3339) + "' and post.PubDate <= '" + query.PubDateTo.Format(time.RFC3339) + "'"
	} else if query.PubDateTo.IsZero() {
		whereClause += " and post.pubDate <= '" + query.PubDateTo.Format(time.RFC3339) + "'"
	} else if query.PubDateFrom.IsZero() {
		whereClause += " and post.pubDate >= '" + query.PubDateFrom.Format(time.RFC3339) + "'"
	}
	//Expand where clause with given category name
	if query.category != "" {
		whereClause += " and category.name = '" + query.category + "'"
	}
	var posts = []Post{}
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	//Preprae statement for getting post count
	stmtPostsCount, err := db.Prepare("Select count(post.slug) from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category " + whereClause + ";")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var rowCount int
	stmtPostsCount.QueryRow().Scan(&rowCount)
	//Prepare statement for getting defined posts from database
	stmtPostsOut, err := db.Prepare("Select post.slug, post.title, category.name, post.coverImage, post.body, post.createdAt,post.updatedAt, post.pubDate, post.isPrivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category " + whereClause + " order by post.pubDate desc limit ? Offset ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	rows, err := stmtPostsOut.Query(query.limit, query.offset)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Go through every gotten row and add informations to posts array
	for rows.Next() {
		var post Post
		err = rows.Scan(&post.Slug, &post.Title, &post.Category, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		posts = append(posts, post)
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { // Give back array of posts
		c.JSON(http.StatusOK, gin.H{
			"posts":     posts,
			"postCount": rowCount,
		})
	}
}

// UpdatePost updates a post by a given slug
func UpdatePost(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	//Reset Errorfeedback
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Update the title in database if title is set in request
	if input.Title != "" {
		stmtPostUpdate, err := db.Prepare("update post set title = ? where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.Title, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
	//Update the category in database if category is set in request
	if input.Category != "" {
		stmtPostUpdate, err := db.Prepare("update post set category = (select id from category where name = ?) where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.Category, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
	//Update the cover image in database if cover image is set in request
	if input.CoverImage != "" {
		stmtPostUpdate, err := db.Prepare("update post set coverImage = ? where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.CoverImage, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
	//Update the publication date in database if pubDate is set in request
	if !(input.PubDate.IsZero()) {
		stmtPostUpdate, err := db.Prepare("update post set pubDate = ? where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.PubDate, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
	//Control, if body is set in request (mandatory) and update in database, else, give back error
	if input.Body == "" {
		errFeedback = append(errFeedback, "body is empty")
	} else {
		stmtPostUpdate, err := db.Prepare("update post set body = ? where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.Body, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
	//Set isPrivate to current state, given in request
	stmtPostUpdate, err := db.Prepare("update post set isPrivate = ? where slug = ? and oAuthID = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtPostUpdate.Exec(input.IsPrivate, slug, oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Set the current time as updated at time
	updatedAt := time.Now()
	stmtPostUpdate, err = db.Prepare("update post set updatedAt = ? where slug = ? and oAuthID = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtPostUpdate.Exec(updatedAt, slug, oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Run GetPost to give back the current post
		GetPost(c)
	}
}

//CreatePost creates a new Post and stores it in db
func CreatePost(c *gin.Context) {
	//Get informations from Request
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	//Reset Errorfeedback
	errFeedback = nil
	//Create database connection
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	//Set created at time to now
	if input.PubDate.IsZero() {
		input.PubDate = time.Now()
	}
	createdAt := time.Now()
	//Insert given post into database
	stmtPostCreate, err := db.Prepare("Insert into post (title,category,coverImage,body,oAuthID,createdAt,updatedAt,pubDate,isPrivate) Values (?,(Select slug from category where name = ?),?,?,?,?,?,?,?)")
	_, err = stmtPostCreate.Exec(input.Title, input.Category, input.CoverImage, input.Body, oAuthID, createdAt, createdAt, input.PubDate, input.IsPrivate)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var post = Post{}
	//Get back information from created post
	stmtPostsOut, err := db.Prepare("Select post.slug, post.title, category.name, post.coverImage, post.body, post.createdAt,post.updatedAt, post.pubDate, post.isPrivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category where user.oAuthID = ? and post.title = ? order by createdAt desc limit 1")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, input.Title).Scan(&post.Slug, &post.Title, &post.Category, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)
	if post.Title == "" {
		errFeedback = append(errFeedback, "Post not found")
	}
	//Give back cumulated error list
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else { //Give back created post
		c.JSON(http.StatusOK, gin.H{
			"post": post,
		})
	}
}
