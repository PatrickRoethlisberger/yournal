package main

import (
	"database/sql"
	"errors"

	_ "github.com/go-sql-driver/mysql"
)

//CreateDBConnection creates a connection to the mysql Database
func CreateDBConnection() *sql.DB {
	db, err := sql.Open("mysql", "yournal:hIYzQPTNysFTIuCb@/yournal")
	if err != nil {
		panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}

	// Open doesn't open a connection. Validate DSN data:
	err = db.Ping()
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	return db
}

//GetUserInformation gets the userinformation for the current User from DB
func GetUserInformation(oAuthID string) (u string, e string, i string, t string, err error) {
	var username, email, image, oAuthType string = "", "", "", ""
	db := CreateDBConnection()
	defer db.Close()
	stmtUserOut, err := db.Prepare("Select oAuthType, username, email, image from user where oAuthID = ?")
	if err != nil {
		return "", "", "", "", errors.New("Failed to get User properties")
	}
	stmtUserOut.QueryRow(oAuthID).Scan(&oAuthType, &username, &email, &image)
	return username, email, image, oAuthType, nil
}
