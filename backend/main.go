package main

import "log"

func main() {
	log.Printf("Server started")

	router := NewRouter()

	NewRouterGroup(router, "/v1")

	log.Fatal(router.Run("localhost:3000"))
}
