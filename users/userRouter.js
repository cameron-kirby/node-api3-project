const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body.name)
        .then(user => {
            res.status(201).json({ message: 'Successfully created user.' })
        })
        .catch(error => {
            res.status(400).json({ errorMessage: 'There was an error creating the user.' })
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    Posts.insert({text: req.body.text, user_id: req.params.id})
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(400).json({errorMessage: "There was an error creating post"})
        })
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json({users})
        })
        .catch(error => {
            res.status(400).json({ errorMessage: 'There was an error getting users.' })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json({user: req.user})
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(400).json({ errorMessage: "There was an error collecting specified user's posts."})
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    Users.remove(req.params.id)
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(400).json({ errorMessage: "There was an error deleting user." })
        })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const changes = req.body
    Users.update(req.params.id, changes)
        .then(user => {
            res.status(202).json(user)
        })
        .catch(error => {
            res.status(400).json({ errorMessage: 'There was an error updating the specified user.' })
        })
});

//custom middleware

function validateUserId(req, res, next) {
  // validateUserId validates the user id on every request that expects a user id parameter
  // if the id parameter is valid, store that user object as req.user
  // if the id parameter does not match any user id in the database, cancel the request and respond with status 400 and { message: "invalid user id" }
  // do your magic!
    Users.getById(req.params.id)
        .then(user => {
            req.user = user
            next()
        })
        .catch(error => {
            res.status(404).json({ errorMessage: 'User not found with specified ID' })
        })
}

function validateUser(req, res, next) {
    if(req.body){
        if(req.body.name.length > 0){
            next()
        } else {
            res.status(400).json({ message: 'Missing required name field' })
        }
    } else {
        res.status(400).json({ message: 'Missing user data' })
    }
}

function validatePost(req, res, next) {
    if(req.body){
        if(req.body.text) {
            next()
        } else {
            res.status(400).json({ message: 'Missing post text' })
        }
    } else {
        res.status(400).json({ message: 'Missing post data' })
    }
}

module.exports = router;
