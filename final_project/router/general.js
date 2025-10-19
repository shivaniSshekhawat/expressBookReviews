const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js"); // local DB
const public_users = express.Router();

// Task 10: Get the list of books using async-await
public_users.get('/async-books', async (req, res) => {
    try {
        // Simulate async call (e.g., fetching from DB/API)
        let bookList = await new Promise((resolve, reject) => {
            resolve(books); // resolving immediately with local DB
        });
        res.send(JSON.stringify(bookList, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error fetching book list", error: err });
    }
});

// Task 11: Get book details by ISBN using async-await
public_users.get('/async-isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        let book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        res.send(JSON.stringify(book, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 12: Get book details by Author using async-await
public_users.get('/async-author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        let result = await new Promise((resolve, reject) => {
            let filtered = Object.keys(books)
                .filter(isbn => books[isbn].author.toLowerCase() === author)
                .map(isbn => ({ isbn, ...books[isbn] }));

            if (filtered.length > 0) resolve(filtered);
            else reject("No books found for this author");
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 13: Get book details by Title using async-await
public_users.get('/async-title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        let result = await new Promise((resolve, reject) => {
            let filtered = Object.keys(books)
                .filter(isbn => books[isbn].title.toLowerCase() === title)
                .map(isbn => ({ isbn, ...books[isbn] }));

            if (filtered.length > 0) resolve(filtered);
            else reject("No books found with this title");
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;
