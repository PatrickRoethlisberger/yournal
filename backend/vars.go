package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

//Route Type for defining different API-Routes
type Route struct {
	// Name is the name of this Route.
	Name string
	// Method is the string for the HTTP method. ex) GET, POST etc..
	Method string
	// Pattern is the pattern of the URI.
	Pattern string
	// HandlerFunc is the handler function of this route.
	HandlerFunc gin.HandlerFunc
}

//Post defines a struct of Items in a Post
type Post struct {
	Slug string `json:"slug"`

	Title string `json:"title"`

	CoverImage string `json:"coverImage"`

	Body string `json:"body"`

	CreatedAt string `json:"createdAt"`

	UpdatedAt string `json:"updatedAt"`

	Public string `json:"public"`

	Author User `json:"author"`
}

//User defines the structure of a User in db
type User struct {
	//E-Mail Adress of the User
	EMail string `json:"email"`

	//Name of the User chosen oAuth Provider
	OAuthType string `json:"oAuthType"`

	// oAuth ID provided by oAuth Provider
	OAuthID string `json:"oAuthID"`

	// User chosen username
	Username string `json:"username,omitempty"`

	// User chosen profileimage
	Image string `json:"image,omitempty"`
}

// TestUserVerifier provides user credentials verifier for testing.
type TestUserVerifier struct {
}

// Routes is the list of the generated Route.
type Routes []Route

//UserData gives a structure for oAuth credentials
type UserData struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	Picture       string `json:"picture"`
	VerifiedEmail bool   `json:"verified_email"`
}

const secret string = "Yournal_secret"

var (
	//GoogleOauthConfig defines the configuration for Google Authentication
	GoogleOauthConfig *oauth2.Config
	db                *sql.DB
	clientsecret      string
	tokenid           string
)

var routes = Routes{
	{
		"DeletePost",
		http.MethodDelete,
		"/posts/:slug",
		DeletePost,
	},

	{
		"GetPost",
		http.MethodGet,
		"/posts/:slug",
		GetPost,
	},

	{
		"GetPosts",
		http.MethodGet,
		"/posts",
		GetPosts,
	},

	{
		"UpdatePost",
		http.MethodPut,
		"/posts/:slug",
		UpdatePost,
	},

	{
		"GetCurrentUser",
		http.MethodGet,
		"/users",
		GetCurrentUser,
	},
	{
		"UpdateCurrentUser",
		http.MethodPut,
		"/users",
		UpdateCurrentUser,
	},
}
