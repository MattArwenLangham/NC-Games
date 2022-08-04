const {
    commentControllers: {
        deleteCommentById
    }
} = require("../controllers/index")
const commentController = require('express').Router()

commentController.delete('/:comment_id', deleteCommentById)

module.exports = commentController