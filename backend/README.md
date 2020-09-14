# Project Title

This backend gives you a connection to database and provides the Yournal information to the frontend.

## Getting Started

Before starting the application you need to set the os variables google_id, google_pw, sql_username and sql_password

when you have set this, you can just run the backend for testing purpose using go run ./..

If you want to change the mapping port, you can to this by editing the URL and port in main.go.

### Prerequisites

To use the Yournal backend, you need to install the following frameworks:

-	https://github.com/appleboy/gin-jwt/v2
-	https://github.com/go-sql-driver/mysql
-	https://github.com/gin-gonic
-	https://github.com/gin-contrib
-	https://github.com/maxzerbini/oauth
-	https://github.com/pkg/errors

you can do this by running go get <framework> in your favorite go shell

for example to get gin-gonic, you have to write

go get https://github.com/gin-gonic

### Installing

To install the package, you first have to build it. You can do this by just running go build in your favorite shell inside your project folder.

If you want to compile for a different operating system, you can to this by setting an environment variable goos with the value linux or windows.

## Running the tests

You can use the API with defaukt configuration by sending requests to http://localhost:3000/v1/

The backend gives you the following APIs:

without auth token:
GET     /v1/                    Index           gives back a string that the API is functional
GET     /v1/auth                authorization   gives you the possible oAuth providers (at the moment only Google)
POST    /v1/auth                authorization   authorize with oAuth-provider

with auth token:
GET     /v1/posts               posts           gets a list of posts, can be filtered by query parameters
POST    /v1/posts               posts           stores a new post to the database, POST has to be text/json
GET     /v1/posts/:slug         posts           Gets a single post by given slug
PUT     /v1/posts/:slug         posts           updates a single post, PUT has to be text/json
DELETE  /v1/posts/:slug         posts           deletes a single post
GET     /v1/categories          categories      gets a list os categories
POST    /v1/categories          categories      stores a new category to the database, POST has to be text/json
DELETE  /v1/categories/:slug    categories      deletes a single category by given slug, category can't be used by active post

## Authors

* **Marc Bannier** - *Initial work* - [Fireslayer92](https://github.com/Fireslayer92)

See also the list of [contributors](https://github.com/PatrickRoethlisberger/TIL-book/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

