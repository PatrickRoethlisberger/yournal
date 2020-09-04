package main

import (
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

// DeletePost deletes a post on a given slug
func DeletePost(c *gin.Context) {
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	errFeedback = nil
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	stmtDelPost, err := db.Prepare("Delete from post where oAuthID = ? and post.slug = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtDelPost.Exec(oAuthID, slug)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		c.String(http.StatusOK, "OK")
	}
}

// GetPost gets a single Post by given slug
func GetPost(c *gin.Context) {
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	var post = Post{}
	errFeedback = nil
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	stmtPostsOut, err := db.Prepare("Select post.slug, category.name, post.title, post.coverImage, post.body, post.createdAt, post.updatedAt, post.pubDate, post.isprivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category where user.oAuthID = ? and post.slug = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, slug).Scan(&post.Slug, &post.Category, &post.Title, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)

	if post.Title == "" {
		errFeedback = append(errFeedback, "Post not found")
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"post": post,
		})
	}
}

// GetPosts function gets all posts on a given filter
func GetPosts(c *gin.Context) {
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	errFeedback = nil
	var whereClause string
	var query Query
	query.limit, _ = c.GetQuery("limit")
	query.author, _ = c.GetQuery("author")
	query.offset, _ = c.GetQuery("offset")
	query.PubDate, _ = c.GetQuery("pubDate")
	query.category, _ = c.GetQuery("category")
	if query.limit == "" {
		query.limit = "15"
	}
	if query.offset == "" {
		query.offset = "0"
	}
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
	if query.PubDate != "" {
		whereClause += " and post.pubDate = '" + query.PubDate + "'"
	}
	if query.category != "" {
		whereClause += " and category.name = '" + query.category + "'"
	}
	var posts = []Post{}
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	stmtPostsOut, err := db.Prepare("Select post.slug, post.title, category.name, post.coverImage, post.body, post.createdAt,post.updatedAt, post.pubDate, post.isPrivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category " + whereClause + " order by post.updatedAt desc limit ? Offset ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	rows, err := stmtPostsOut.Query(query.limit, query.offset)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var rowCount int = 0
	for rows.Next() {
		var post Post
		err = rows.Scan(&post.Slug, &post.Title, &post.Category, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		posts = append(posts, post)
		rowCount++
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"posts":     posts,
			"postCount": rowCount,
		})
	}
}

// UpdatePost updates a post by a given slug
func UpdatePost(c *gin.Context) {
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	slug := c.Param("slug")
	errFeedback = nil
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
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
	if input.PubDate != "" {
		stmtPostUpdate, err := db.Prepare("update post set pubDate = ? where slug = ? and oAuthID = ?")
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
		_, err = stmtPostUpdate.Exec(input.PubDate, slug, oAuthID)
		if err != nil {
			errFeedback = append(errFeedback, err.Error())
		}
	}
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
	stmtPostUpdate, err := db.Prepare("update post set isPrivate = ? where slug = ? and oAuthID = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtPostUpdate.Exec(input.IsPrivate, slug, oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	updatedAt := time.Now()
	stmtPostUpdate, err = db.Prepare("update post set updatedAt = ? where slug = ? and oAuthID = ?")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	_, err = stmtPostUpdate.Exec(updatedAt, slug, oAuthID)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		GetPost(c)
	}
}

//CreatePost creates a new Post and stores it in db
func CreatePost(c *gin.Context) {
	tokenClaims := jwt.ExtractClaims(c)
	oAuthID := tokenClaims["id"].(string)
	errFeedback = nil
	db, err := CreateDBConnection()
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	defer db.Close()
	var input PostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	createdAt := time.Now()
	stmtPostCreate, err := db.Prepare("Insert into post (title,category,coverImage,body,oAuthID,createdAt,updatedAt,pubDate,isPrivate) Values (?,(Select id from category where name = ?),?,?,?,?,?,?,?)")
	_, err = stmtPostCreate.Exec(input.Title, input.Category, input.CoverImage, input.Body, oAuthID, createdAt, createdAt, input.PubDate, input.IsPrivate)
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	var post = Post{}
	stmtPostsOut, err := db.Prepare("Select post.slug, post.title, category.name, post.coverImage, post.body, post.createdAt,post.updatedAt, post.pubDate, post.isPrivate, user.oAuthID, user.email, user.oAuthType, user.Username, user.Image from post join user on user.oAuthID = post.oAuthID join category on category.slug = post.category where user.oAuthID = ? and post.title = ? order by createdAt desc")
	if err != nil {
		errFeedback = append(errFeedback, err.Error())
	}
	stmtPostsOut.QueryRow(oAuthID, input.Title).Scan(&post.Slug, &post.Title, &post.Category, &post.CoverImage, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.PubDate, &post.IsPrivate, &post.Author.OAuthID, &post.Author.EMail, &post.Author.OAuthType, &post.Author.Username, &post.Author.Image)
	if post.Title == "" {
		errFeedback = append(errFeedback, "Post not found")
	}
	if errFeedback != nil {
		c.JSON(422, gin.H{
			"errors": gin.H{"body": errFeedback},
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"post": post,
		})
	}
}
