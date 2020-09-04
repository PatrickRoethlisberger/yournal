package main

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

//Query Type defines the input variables for a GET-Query on posts
type Query struct {
	author   string `query:"author"`
	limit    string `query:"limit"`
	offset   string `query:"offset"`
	PubDate  string `query:"pubDate"`
	category string `query:"category"`
}

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

//PostInput defines the Type of a Input for Update / Create Post
type PostInput struct {
	Title      string `json:"title"`
	Category   string `json:"category"`
	CoverImage string `json:"coverImage"`
	Body       string `json:"body"`
	IsPrivate  bool   `json:"isPrivate"`
	PubDate    string `json:"pubDate"`
}

//Post defines a struct of Items in a Post
type Post struct {
	Slug string `json:"slug"`

	Title string `json:"title"`

	Category string `json:"category"`

	CoverImage string `json:"coverImage"`

	Body string `json:"body"`

	CreatedAt time.Time `json:"createdAt"`

	UpdatedAt time.Time `json:"updatedAt"`

	PubDate time.Time `json:"pubDate"`

	IsPrivate string `json:"isPrivate"`

	Author User `json:"author"`
}

//Category defines the struct of items in a Category
type Category struct {
	Slug string `json:"slug"`

	Name string `json:"title"`
}

//CategoryInput defines the struct of a json input for Category
type CategoryInput struct {
	Name string `json:"title"`
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
	errFeedback       []string
	ers               error
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
	{
		"CreatePost",
		http.MethodPost,
		"/posts",
		CreatePost,
	},
	{
		"CreateCategory",
		http.MethodPost,
		"/category",
		CreateCategory,
	},
	{
		"GetCategories",
		http.MethodGet,
		"/category",
		GetCategories,
	},
	{
		"GetCategory",
		http.MethodGet,
		"/category/:slug",
		GetCategory,
	},
	{
		"DeleteCategory",
		http.MethodDelete,
		"/category/:slug",
		DeleteCategory,
	},
}
