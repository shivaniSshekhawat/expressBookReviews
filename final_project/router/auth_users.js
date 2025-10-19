const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // registered users

// Task 7: Check if username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Task 7: Check if username and password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        // Create JWT token valid for 1 hour
        const accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });

        // Save user session info
        req.session.authorization = { accessToken, username };

        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
    const review = req.query.review;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review for this username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} added/updated`, reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted`, reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
