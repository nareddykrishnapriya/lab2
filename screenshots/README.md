# Screenshots Directory

Save your actual Postman and SQLite database screenshots in this folder using the following filenames:

1. `get_all_books.png`
   - Screenshot of Postman showing GET `http://localhost:3000/books/` returning all 10 books with status `200 OK`.

2. `get_book_by_id.png`
   - Screenshot of Postman showing GET `http://localhost:3000/books/1/` returning a single book object with status `200 OK`.

3. `post_new_book.png`
   - Screenshot of Postman showing POST `http://localhost:3000/books/` with JSON body returning status `201 Created` and `bookId`.

4. `put_update_book.png`
   - Screenshot of Postman showing PUT `http://localhost:3000/books/1/` with updated JSON body returning status `200 OK` and `"Book Details Updated Successfully"`.

5. `delete_book.png`
   - Screenshot of Postman showing DELETE `http://localhost:3000/books/10/` returning status `200 OK` and `"Book Deleted Successfully"`.

6. `sqlite_database_output.png`
   - Screenshot of your SQLite database viewer (e.g., DB Browser for SQLite, VS Code SQLite extension, or terminal query output) showing the `book` table records.
