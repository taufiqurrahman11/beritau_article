# Beritau Challenge Week 5

Express API with basic routes:

- Express
- joi
- sequelize
- mysql2
- jwt
- dotenv
- nodemailer
- multer
- redis

---

## MVP

Terdapat 2 MVP dalam mini-project ini,

- Verify Email Register using nodemailer
- Cache data using redis

## ABOUT

Berikut ini merupakan API web berita, dalam sistem ini terdapat 2 role, yaitu reader dan writer. Server ini memiliki tiga tabel, yaitu tabel user, tabel article, dan tabel bookmark. Tabel bookmark menjadi tabel penghubung relasi many-to-many, dimana setiap user dapat melakukan banyak bookmark artikel dan setiap artikel dapat di-bookmark oleh banyak user.

## URL

SERVER

```
http://localhost:3001
```

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (401)_

```
{
    "message": "Authentication failed, you need token"
}
```

_Response (403)_

```
{
    "message": "Invalid token",
    "error": "Token verification failed"
}
```

_Response (404 - Not Found)_

```

{
"message": "API not found"
}

```

---

# RESTful endpoints

## AUTH (LOGIN, REGISTER, VERIFY EMAIL)

### REGISTER (POST)

Example

```
localhost:3001/api/register
```

_Request Header_

```
not needed
```

_Request Body_

```
{
    "fullName": "taufiq",
    "password": "123456",
    "email": "taufiqoo.sa@gmail.com",
    "phone": "081281920573",
    "role": "writer"
}
```

_Response (201)_

```
{
    "data": {
        "id": 11,
        "fullName": "taufiq",
        "password": "$2a$10$W.klui73TMMJDvhHgJD82.xaGbyt3ORIHbb761mKpeBEQs6q3C6TW",
        "email": "taufiqoo.sa@gmail.com",
        "phone": "08128371321",
        "role": "writer",
        "isVerified": false,
        "tokenVerified": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA4MTUwNjAsImV4cCI6MTcwMDgxODY2MH0.cOKpmku4oP2sS2-wXOdOhuGVi2AFm7b5QoJ9VpH4BG8",
        "updatedAt": "2023-11-24T08:37:40.933Z",
        "createdAt": "2023-11-24T08:37:40.933Z"
    },
    "message": "User created successfully"
}
```

_Response (400)_ -> All field required

```
{
    "status": "Validation Failed",
    "message": "\"fullName\" is not allowed to be empty"
}
```

_Response (400)_

```
{
    "message": "Phone already exists"
}
```

_Response (400)_

```
{
    "message": "Email has already exists"
}
```

---

### VERIFY EMAIL (GET)

Example

```
localhost:3001/api/verify/:tokenVerified
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_
nantinya akan teredirect ke page Verify di frontend

```
{
res.redirect('http://localhost:3001/verify-success');
}
```

_Response (401)_

```
{
    "message": "Invalid token or user not found"
}
```

---

### LOGIN (POST)

Example

```
localhost:3001/api/login
```

_Request Header_

```
not needed
```

_Request Body_

```
{
    "email": "taufiqoo.sa@gmail.com",
    "password": "123456"
}
```

_Response (200)_

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IndyaXRlciIsImlhdCI6MTcwMDgxNTMwNSwiZXhwIjoxNzAwODE4OTA1fQ.jIjOrRPqRjwHCsbttJJzvhRT1DQMA8BdoaE8D4iF1NA",
    "message": "Login successful",
    "data": {
        "id": 7,
        "fullName": "Taufiqurrahman Saleh",
        "email": "taufiqoo.sa@gmail.com",
        "phone": "08128371321",
        "role": "writer"
    }
}
```

_Response (400)_ -> All field required

```
{
    "status": "Validation Failed",
    "message": "\"email\" is not allowed to be empty"
}
```

_Response (400)_

```
{
    "message": "Invalid email or password"
}
```

_Response (401)_

```
{
    "message": "Account not verified"
}
```

---

## READER (USER)

### GET ALL ARTICLE

Example

```
localhost:3001/api/user/article
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Data from cache",
    "data": [
        {
            "id": <id>,
            "category": <category>,
            "title": <title>,
            "description": <description>
            "author": <author>,
            "date": <date>,
            "photoArticle": <photoArticle>,
            "userId": <userId>
        },
        {
            "id": <id>,
            "category": <category>,
            "title": <title>,
            "description": <description>
            "author": <author>,
            "date": <date>,
            "photoArticle": <photoArticle>,
            "userId": <userId>
        }
    ]
}
```

---

### GET ARTICLE BY ID

Example

```
localhost:3001/api/user/article/:articleId
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": {
        "id": <id>,
        "category": <category>,
        "title": <title>,
        "description": <description>
        "author": <author>,
        "date": <date>,
        "photoArticle": <photoArticle>,
        "userId": <userId>
    },
    "message": "Successfully get article by Id"
}
```

_Response (404)_

```
{
"message": "Article not found"
}
```

---

### GET PROFILE

Example

```
localhost:1/api/user/getProfile
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": {
        "id": 7,
        "fullName": "Taufiqurrahman Saleh",
        "email": "taufiqoo.sa@gmail.com",
        "phone": "08128371321",
        "isVerified": true,
        "tokenVerified": null,
        "role": "writer",
        "Articles": [],
        "userBookmark": []
    },
    "message": "Successfully get user by Id with articles"
}
```

_Response (404)_

```
{
"message": "User not found"
}

```

---

### CHANGE PASSWORD (PUT)

Example

```
localhost:3001/api/user/password
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "oldPassword": <oldPassword>,
    "newPassword": <newPassword>
}
```

_Response (200)_

```
{
    "message": "Password updated successfully"
}
```

_Response (401)_

```
{
    "message": "Invalid old password"
}

```

_Response (404)_

```
{
    "message": "User not found"
}

```

---

### GET BOOKMARK

Example

```
localhost:3001/api/user/bookmark
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Caching redis",
    "data": [
        {
            "id": <id>,
            "userId": <usrerId>,
            "articleId": <articleId>,
            "articleBookmark": {
                "id": <id>,
                "category": <category>,
                "title": <title>,
                "description": <description>
                "author": <author>,
                "date": <date>,
                "photoArticle": <photoArticle>,
                "userId": <userId>
            }
        }
    ]
}
```

---

### ADD ARTICLE TO BOOKMARK

Example

```
localhost:3001/api/user/bookmark/:articleId
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Caching redis",
    "data": [
        {
            "id": <id>,
            "userId": <usrerId>,
            "articleId": <articleId>,
            "articleBookmark": {
                "id": <id>,
                "category": <category>,
                "title": <title>,
                "description": <description>
                "author": <author>,
                "date": <date>,
                "photoArticle": <photoArticle>,
                "userId": <userId>
            }
        }
    ]
}
```

_Response (400)_

```
{
    "message": "Article already bookmarked"
}
```

_Response (404)_

```
{
    "message": "Article not found"
}
```

---

### DELETE ARTICLE FROM BOOKMARK

Example

```
localhost:3001/api/user/bookmark/:articleId
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": {},
    "message": "Bookmark removed successfully"
}
```

_Response (404)_

```
{
    "message": "Bookmark not found"
}
```

_Response (404)_

```
{
    "message": "Article not found"
}
```

---

## WRITER

### CREATE ARTICLE

Example

```
localhost:3001/api/writer/article
```

_Request Header_

```
not needed
```

_Request Body_

```
form-data using multer
{
    "title": <title>,
    "category": <category>,
    "photoArticle: <photoArticle.jpeg>,
    "description": <description>
}
```

_Response (200)_

```
{
    "message": "Article added successfully",
    "data":
        {
            "id": <id>,
            "category": <category>,
            "title": <title>,
            "description": <description>
            "author": <author>,
            "date": <date>,
            "photoArticle": <photoArticle>,
            "userId": <userId>
        }
}
```

---

### DELETE ARTICLE

Example

```
localhost:3001/api/writer/article/:articleId
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Article deleted successfully"
}
```

_Response (404)_

```
{
    "message": "Article not found"
}
```

---
