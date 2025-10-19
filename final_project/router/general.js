const express = require('express');
let books = require("./booksdb.js"); // local DB
const public_users = express.Router();


// Task 1: Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate async operation (if needed)
        const bookList = await Promise.resolve(books);
        return res.send(JSON.stringify(bookList, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await Promise.resolve(books[isbn]); 

        if (book) {
            return res.send(JSON.stringify(book, null, 4));
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const result = await Promise.resolve(
            Object.entries(books)
                .filter(([isbn, book]) => book.author.toLowerCase() === author)
                .map(([isbn, book]) => ({ isbn, ...book }))
        );

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const result = await Promise.resolve(
            Object.keys(books)
                .filter(isbn => books[isbn].title.toLowerCase() === title)
                .map(isbn => ({ isbn, ...books[isbn] }))
        );

        if (result.length > 0) {
            return res.send(JSON.stringify(result, null, 4));
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});



module.exports.general = public_users;
