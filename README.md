# Lab 2: SQLite Database and CRUD Routes

## Student Details

- **Student Name:** N Anantha Krishna Priya
- **Registration Number:** [Registration Number - e.g., 252U1R7067]
- **Section:** [Section - e.g., CSE FSD 2B]
- **Course:** Backend Development Fundamentals
- **Lab Number:** 02

---

## Live Deployment Status

- **Status:** Local testing completed successfully.
- **Deployment Explanation:** Live cloud deployment (e.g., Render, Railway, or Vercel) requires persistent file-system storage or managed database provisioning (such as Turso or PostgreSQL) since ephemeral serverless instances do not persist local SQLite file writes across restarts. As per standard lab requirements, this project is configured and validated for local execution and grading.

---

## Project Description

This project implements a complete backend RESTful API service for a Library Management System using **Node.js**, **Express.js**, and an embedded **SQLite** database (`library.db`).

The application demonstrates:
- Connecting asynchronously to an SQLite database using `sqlite` and `sqlite3`.
- Starting the Express server only after the database connection succeeds (`initializeDBAndServer()`).
- Building all five fundamental CRUD (Create, Read, Update, Delete) routes.
- Executing parameterized SQL queries using `?` placeholders to defend against SQL Injection vulnerabilities.
- Handling HTTP status codes appropriately (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`).
- Parsing incoming JSON payloads using Express's built-in `express.json()` middleware.

---

## Technologies Used

- **Node.js** (v24.16.0) - Asynchronous JavaScript runtime environment.
- **Express.js** (v5.3.0) - Minimalist web framework for Node.js.
- **SQLite3** (v6.0.1) & **SQLite** (v5.1.1) - Lightweight, file-based relational database management system and async promise wrapper.
- **Nodemon** (v3.1.14) - Development utility for automatic server restarts upon file changes.
- **Postman** / REST Client - Tool for validating API endpoints and payloads.

---

## Project Structure

```text
lab-02/
├── app.js               # Main application file containing Express setup, database connection, and CRUD routes
├── library.db           # SQLite database file containing the 'book' table and sample data
├── package.json         # Project metadata, scripts, and dependencies
├── package-lock.json    # Exact dependency tree lockfile
├── .gitignore           # Git ignore rules for node_modules and environment variables
├── README.md            # Comprehensive project documentation and API guide
└── screenshots/         # Directory designated for Postman and database output screenshots
    ├── README.md
    ├── get_all_books.png
    ├── get_book_by_id.png
    ├── post_new_book.png
    ├── put_update_book.png
    ├── delete_book.png
    └── sqlite_database_output.png
```

---

## Database Schema and Initial Records

### Table: `book`

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each book record |
| `title` | `TEXT` | `NOT NULL` | Title of the book |
| `author` | `TEXT` | `NOT NULL` | Author of the book |
| `price` | `INTEGER` | `NOT NULL` | Price in INR |
| `pages` | `INTEGER` | `NOT NULL` | Total number of pages |

### 10 Pre-populated Sample Records

| id | title | author | price | pages |
|---|---|---|---|---|
| 1 | The Great Gatsby | F. Scott Fitzgerald | 450 | 180 |
| 2 | To Kill a Mockingbird | Harper Lee | 520 | 281 |
| 3 | 1984 | George Orwell | 399 | 328 |
| 4 | Pride and Prejudice | Jane Austen | 350 | 279 |
| 5 | The Catcher in the Rye | J.D. Salinger | 420 | 214 |
| 6 | The Hobbit | J.R.R. Tolkien | 599 | 310 |
| 7 | Fahrenheit 451 | Ray Bradbury | 380 | 256 |
| 8 | Brave New World | Aldous Huxley | 410 | 268 |
| 9 | Crime and Punishment | Fyodor Dostoevsky | 650 | 545 |
| 10 | The Alchemist | Paulo Coelho | 320 | 208 |

---

## Installation and Setup

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) and **npm** are installed on your system.

Verify installation:
```bash
node -v
npm -v
```

### 2. Navigate to Project Directory
```bash
cd lab-02
```

### 3. Install Dependencies
```bash
npm install
```

This installs `express`, `sqlite`, `sqlite3`, and `nodemon`.

---

## How to Run the Project

### Development Mode (with Nodemon)
To start the server with live file watching and automatic reloading:
```bash
npm start
# or
npm run dev
```

### Standard Mode
```bash
npm run server
# or
node app.js
```

Once started, the console will display:
```text
Server Running at http://localhost:3000/
```

---

## API Endpoints Reference

| API # | HTTP Method | Endpoint URL | Description | Status Code |
|---|---|---|---|---|
| **API 1** | `GET` | `/books/` | Retrieve all book records from database | `200 OK` |
| **API 2** | `GET` | `/books/:bookId/` | Retrieve a single book record by ID | `200 OK` / `404 Not Found` |
| **API 3** | `POST` | `/books/` | Insert a new book record into database | `201 Created` / `400 Bad Request` |
| **API 4** | `PUT` | `/books/:bookId/` | Update details of an existing book by ID | `200 OK` / `404 Not Found` |
| **API 5** | `DELETE` | `/books/:bookId/` | Remove a book record by ID | `200 OK` / `404 Not Found` |

---

## Detailed API Documentation & Example Payloads

### API 1: Get All Books
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/`
- **Request Headers:** None
- **Request Body:** None
- **Response Status:** `200 OK`
- **Sample Response Body:**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 450,
    "pages": 180
  },
  {
    "id": 2,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "price": 520,
    "pages": 281
  }
]
```

---

### API 2: Get Book by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/books/1/`
- **Request Headers:** None
- **Request Body:** None
- **Response Status:** `200 OK`
- **Sample Response Body:**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 450,
  "pages": 180
}
```

- **Error Cases:**
  - Non-existent ID (`GET /books/999/`): Returns `404 Not Found`
    ```json
    {
      "error": "Book with ID 999 not found."
    }
    ```
  - Invalid format (`GET /books/abc/`): Returns `400 Bad Request`
    ```json
    {
      "error": "Invalid Book ID format. ID must be an integer."
    }
    ```

---

### API 3: Add a New Book
- **Method:** `POST`
- **URL:** `http://localhost:3000/books/`
- **Request Headers:** `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 650,
  "pages": 464
}
```
- **Response Status:** `201 Created`
- **Sample Response Body:**
```json
{
  "message": "Book Successfully Added",
  "bookId": 11
}
```

---

### API 4: Update a Book
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/1/`
- **Request Headers:** `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "title": "The Great Gatsby (Collector Edition)",
  "author": "F. Scott Fitzgerald",
  "price": 499,
  "pages": 190
}
```
- **Response Status:** `200 OK`
- **Sample Response Body:**
```json
{
  "message": "Book Details Updated Successfully"
}
```

- **Error Case:**
  - Non-existent ID (`PUT /books/999/`): Returns `404 Not Found`
    ```json
    {
      "error": "Book with ID 999 not found."
    }
    ```

---

### API 5: Delete a Book
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/books/10/`
- **Request Headers:** None
- **Request Body:** None
- **Response Status:** `200 OK`
- **Sample Response Body:**
```json
{
  "message": "Book Deleted Successfully"
}
```

- **Error Case:**
  - Non-existent ID (`DELETE /books/999/`): Returns `404 Not Found`
    ```json
    {
      "error": "Book with ID 999 not found."
    }
    ```

---

## Testing & Verification

All five CRUD endpoints were thoroughly tested and verified:
1. **GET `/books/`**: Verified that all records are fetched and returned as an array.
2. **GET `/books/:bookId/`**: Verified retrieval of individual book by primary key, with 404 handling for invalid keys.
3. **POST `/books/`**: Verified that inserting a record increases the database count and auto-increments the ID.
4. **PUT `/books/:bookId/`**: Verified that updating fields modifies the record in SQLite without affecting other records.
5. **DELETE `/books/:bookId/`**: Verified that deleting a record removes it from SQLite and returns a 404 on subsequent lookups.
6. **SQL Injection Defense**: Confirmed that all SQL queries use parameterized `?` placeholders.

---

## Screenshots

Place your actual test screenshots into the `screenshots/` directory matching the filenames below:

### 1. GET All Books (`/books/`)
![GET All Books](screenshots/get_all_books.png)

### 2. GET Book by ID (`/books/:bookId/`)
![GET Book by ID](screenshots/get_book_by_id.png)

### 3. POST Add New Book (`/books/`)
![POST Add New Book](screenshots/post_new_book.png)

### 4. PUT Update Book (`/books/:bookId/`)
![PUT Update Book](screenshots/put_update_book.png)

### 5. DELETE Book (`/books/:bookId/`)
![DELETE Book](screenshots/delete_book.png)

### 6. SQLite Database Output
![SQLite Database Output](screenshots/sqlite_database_output.png)
