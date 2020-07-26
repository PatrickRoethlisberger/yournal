package main

import (
	"database/sql"
	"errors"

	_ "github.com/go-sql-driver/mysql"
)

//CreateDBConnection creates a connection to the mysql Database
func CreateDBConnection() *sql.DB {
	db, err := sql.Open("mysql", "yournal:hIYzQPTNysFTIuCb@/yournal?parseTime=true")
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
func GetUserInformation(oAuthID string) (user User, err error) {
	//var username, email, image, oAuthType string = "", "", "", ""
	db := CreateDBConnection()
	defer db.Close()
	stmtUserOut, err := db.Prepare("Select oAuthID, oAuthType, username, email, image from user where oAuthID = ?")
	if err != nil {
		return user, errors.New("Failed to get User properties")
	}
	stmtUserOut.QueryRow(oAuthID).Scan(&user.OAuthID, &user.OAuthType, &user.Username, &user.EMail, &user.Image)
	if user.OAuthID == "" {
		return user, errors.New("Failed to get User properties")
	}
	return user, nil
}
