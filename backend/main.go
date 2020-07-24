package main

import "log"

func main() {
	log.Printf("Server started")

	router := NewRouter()

	NewRouterGroup(router, "/")

	log.Fatal(router.Run(":8080"))
}
