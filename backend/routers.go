package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// NewRouter returns a new router with defined paths
func NewRouter() *gin.Engine {
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.GET("/v1/", Index)
	router.POST("/v1/auth", authMiddleware.LoginHandler)
	router.GET("/v1/auth", ChoseAuthProvider)
	router.GET("/v1/auth/refresh_token", authMiddleware.RefreshHandler)
	return router
}

//NewRouterGroup returns a Router Group for authenticated access
func NewRouterGroup(router *gin.Engine, path string) *gin.RouterGroup {
	group := router.Group(path)
	//Use jwt middleware for router group
	group.Use(authMiddleware.MiddlewareFunc())
	{
		//Get different api routes and present them to router group
		for _, route := range routes {
			switch route.Method {
			case http.MethodGet:
				group.GET(route.Pattern, route.HandlerFunc)
			case http.MethodPost:
				group.POST(route.Pattern, route.HandlerFunc)
			case http.MethodPut:
				group.PUT(route.Pattern, route.HandlerFunc)
			case http.MethodDelete:
				group.DELETE(route.Pattern, route.HandlerFunc)
			}
		}
	}
	return group
}

// Index is the index handler and is only used for testing purposes
func Index(c *gin.Context) {
	c.String(http.StatusOK, "API is fully functional")
}
