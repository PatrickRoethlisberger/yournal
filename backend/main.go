package main

import "log"

func main() {
	//Create a new router
	router := NewRouter()
	//Create a protected routergroup behind login wall
	NewRouterGroup(router, "/v1")
	//Run router on localhost Port 3000
	log.Fatal(router.Run("localhost:3000"))
}
