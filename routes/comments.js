const {
    commentControllers: {
        deleteCommentById,
        patchCommentById
    }
} = require("../controllers/index")
const commentController = require('express').Router()

commentController
.route('/:comment_id')
.patch(patchCommentById)
.delete(deleteCommentById)

module.exports = commentController