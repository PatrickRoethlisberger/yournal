package main

import "log"

/*
   Authorization Server Example
    Generate Token using username & password
    	POST http://localhost:3000/token
		User-Agent: Fiddler
		Host: localhost:3000
		Content-Length: 50
		Content-Type: application/x-www-form-urlencoded
		grant_type=password&username=user01&password=12345
	Generate Token using clientId & secret
    	POST http://localhost:3000/auth
		User-Agent: Fiddler
		Host: localhost:3000
		Content-Length: 66
		Content-Type: application/x-www-form-urlencoded
		grant_type=client_credentials&client_id=abcdef&client_secret=12345
	Refresh Token
		POST http://localhost:3000/token
		User-Agent: Fiddler
		Host: localhost:3000
		Content-Length: 50
		Content-Type: application/x-www-form-urlencoded
		grant_type=refresh_token&refresh_token={the refresh_token obtained in the previous response}
*/

func main() {
	log.Printf("Server started")

	router := NewRouter()

	NewRouterGroup(router, "/")

	log.Fatal(router.Run(":8080"))
}

/*
func main() {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(cors.Default()) // enable Cross-Origin Resource Sharing
	gin.SetMode(gin.DebugMode)
	registerAPI(router)
	router.Run(":3000")
}
*/
