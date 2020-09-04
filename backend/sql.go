package main

import (
	"database/sql"
	"errors"

	_ "github.com/go-sql-driver/mysql"
)

//CreateDBConnection creates a connection to the mysql Database
func CreateDBConnection() (*sql.DB, error) {
	db, err := sql.Open("mysql", "yournal:hIYzQPTNysFTIuCb@/yournal?parseTime=true")
	if err != nil {
		return nil, err
	}

	// Open doesn't open a connection. Validate DSN data:
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}

//GetUserInformation gets the userinformation for the current User from DB
func GetUserInformation(oAuthID string) (user User, err error) {
	//var username, email, image, oAuthType string = "", "", "", ""
	db, err := CreateDBConnection()
	if err != nil {
		return user, errors.New("Failed to get Database connection")
	}
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
