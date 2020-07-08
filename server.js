const express = require('express');
const userRouter = require('./users/userRouter')

const server = express();

// Middleware
// Global
server.use(express.json())
server.use(logger)

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/user', userRouter)


function logger(req, res, next) {
    // Global middleware that logs to the console the following information about each request: 
    // request method, 
    // request url, 
    // and a timestamp
    const timestamp = Date()
    console.log(`-! REQUEST INFO !-`)
    console.log(`Request Method: ${req.method}`)
    console.log(`Request URL: ${req.url}`)
    console.log(`Timestamp: ${timestamp.toString()}`)
    console.log(`------------------`)
    next()
}

module.exports = server;
