##### baseUrl `/api/v1`
`content-type: application-json`

errors:

  `500 Internal Server Error`
  `401 You are already authenticated`
  `401 You are not authenticated`
  `404 Not Found`

### Authors

####`GET '/authors'`
get list of authors

`should be logged in`

######response:
success:
 ```
 200,
 [{
    "id": Number,
    "name": String,
    "surName": String
 }]
 ```

####`POST /authors`

add author
`should be logged in as admin`

######request:
```
{
    "id": Number,
    "name": String,
    "surName": String
}
 ```

 ######response:
 success: `201`
 errors:

### Auth
####`POST /registration`
register new user
create session

`should be not logged in`

######request:
```
{
    "name": String,
    "password": String,
    "photoUrl": String
}
 ```
 ######response:

 success: `201`
 errors:
 `400` on incorrect fields or user existing

####`POST /login`
login user
create session

######request:
```
{
    "name": String,
    "password": String
}
 ```
 ######response:

 success: `201`
 errors:
 `400` on incorrect fields/password or user existing

####`GET /logout`
 logout
 destroy session

`should be logged in`
######response:
 success: `200`
 errors:
 `400` on incorrect fields/password or user existing


### Books
####`GET /books`
get books list

`should be logged in`
######response:
success: 200
```
[{
    id: Number,
    name: String,
    releaseAt: Number,
    clientId: Number
}]
```
####`POST /books`
add new book


`should be logged in as admin`
######request:
```
[{
    name: String,
    releaseAt: Number,
    authors: [Number]
}]
```
######response:
success: `201`
errors:
`400 authors should be array`
`400 incorrect authorId"`
####`PUT /books/{bookId}/take`
take book from client
`should be logged in`

######request:
`bookId: Number`
######response:
success:
`200`
errors:
`400 book is not available`
`400 maximum books taked`
####`PUT /books/{bookId}/return`

return book from client
`should be logged in`

######request:
`bookId: Number`
######response:
success:
`200`
errors:
`400 book is not available`
`400 maximum books taked`
### Clients

####`GET /clients/books`
get list of books which was taken
######response:
success: 200
```
[{
    id: Number,
    name: String,
    releaseAt: Number,
    clientId: Number
}]
```