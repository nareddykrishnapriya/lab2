const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

const dbPath = path.join(__dirname, 'library.db');
let db = null;

// Initialize SQLite database connection and start Express server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Ensure the table exists if starting fresh
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Root welcome route
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to the Library Management API (Lab 2)',
    endpoints: {
      getAllBooks: 'GET /books/',
      getBookById: 'GET /books/:bookId/',
      addBook: 'POST /books/',
      updateBook: 'PUT /books/:bookId/',
      deleteBook: 'DELETE /books/:bookId/'
    }
  });
});

// ==========================================
// API 1: Get all books
// Method: GET
// URL: /books/
// ==========================================
app.get('/books/', async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT 
        * 
      FROM 
        book 
      ORDER BY 
        id ASC;
    `;
    const booksArray = await db.all(getBooksQuery);
    response.status(200).json(booksArray);
  } catch (error) {
    console.error(`Error in GET /books/: ${error.message}`);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// API 2: Get a book by ID
// Method: GET
// URL: /books/:bookId/
// ==========================================
app.get('/books/:bookId/', async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    // Validate that bookId is a valid number
    if (isNaN(parsedId)) {
      return response.status(400).json({
        error: 'Invalid Book ID format. ID must be an integer.'
      });
    }

    const getBookQuery = `
      SELECT 
        * 
      FROM 
        book 
      WHERE 
        id = ?;
    `;
    const book = await db.get(getBookQuery, [parsedId]);

    // Handle missing record
    if (!book) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found.`
      });
    }

    response.status(200).json(book);
  } catch (error) {
    console.error(`Error in GET /books/:bookId/: ${error.message}`);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// API 3: Add a new book
// Method: POST
// URL: /books/
// ==========================================
app.post('/books/', async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validate input fields
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: 'Missing required fields: title, author, price, and pages are required.'
      });
    }

    const parsedPrice = parseInt(price, 10);
    const parsedPages = parseInt(pages, 10);

    if (isNaN(parsedPrice) || isNaN(parsedPages)) {
      return response.status(400).json({
        error: 'Price and pages must be valid integers.'
      });
    }

    const addBookQuery = `
      INSERT INTO 
        book (title, author, price, pages)
      VALUES 
        (?, ?, ?, ?);
    `;

    const dbResponse = await db.run(addBookQuery, [
      title.trim(),
      author.trim(),
      parsedPrice,
      parsedPages
    ]);

    const bookId = dbResponse.lastID;

    response.status(201).json({
      message: 'Book Successfully Added',
      bookId: bookId
    });
  } catch (error) {
    console.error(`Error in POST /books/: ${error.message}`);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// API 4: Update a book
// Method: PUT
// URL: /books/:bookId/
// ==========================================
app.put('/books/:bookId/', async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    // Validate ID
    if (isNaN(parsedId)) {
      return response.status(400).json({
        error: 'Invalid Book ID format. ID must be an integer.'
      });
    }

    // Check if the book exists
    const checkBookQuery = `
      SELECT 
        * 
      FROM 
        book 
      WHERE 
        id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found.`
      });
    }

    const { title, author, price, pages } = request.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: 'Missing required fields: title, author, price, and pages are required.'
      });
    }

    const parsedPrice = parseInt(price, 10);
    const parsedPages = parseInt(pages, 10);

    if (isNaN(parsedPrice) || isNaN(parsedPages)) {
      return response.status(400).json({
        error: 'Price and pages must be valid integers.'
      });
    }

    const updateBookQuery = `
      UPDATE 
        book 
      SET 
        title = ?, 
        author = ?, 
        price = ?, 
        pages = ? 
      WHERE 
        id = ?;
    `;

    await db.run(updateBookQuery, [
      title.trim(),
      author.trim(),
      parsedPrice,
      parsedPages,
      parsedId
    ]);

    response.status(200).json({
      message: 'Book Details Updated Successfully'
    });
  } catch (error) {
    console.error(`Error in PUT /books/:bookId/: ${error.message}`);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// API 5: Delete a book
// Method: DELETE
// URL: /books/:bookId/
// ==========================================
app.delete('/books/:bookId/', async (request, response) => {
  try {
    const { bookId } = request.params;
    const parsedId = parseInt(bookId, 10);

    // Validate ID
    if (isNaN(parsedId)) {
      return response.status(400).json({
        error: 'Invalid Book ID format. ID must be an integer.'
      });
    }

    // Check if the book exists
    const checkBookQuery = `
      SELECT 
        * 
      FROM 
        book 
      WHERE 
        id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [parsedId]);

    if (!existingBook) {
      return response.status(404).json({
        error: `Book with ID ${parsedId} not found.`
      });
    }

    const deleteBookQuery = `
      DELETE FROM 
        book 
      WHERE 
        id = ?;
    `;

    await db.run(deleteBookQuery, [parsedId]);

    response.status(200).json({
      message: 'Book Deleted Successfully'
    });
  } catch (error) {
    console.error(`Error in DELETE /books/:bookId/: ${error.message}`);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
