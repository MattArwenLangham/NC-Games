const { insertComment, updateCommentById, removeCommentById } = require("../models/comments")
const { fetchReviewById } = require("../models/reviews")
const { retrieveUserByUsername } = require("../models/users")

exports.postComment = (req, res, next) => {
    const { review_id } = req.params
    const {username, body} = req.body

    Promise.all([fetchReviewById(review_id), retrieveUserByUsername(username)])
    .then(() => {
        return insertComment(body, review_id, username)
        .then((comment) => {
            res.status(201).send({ comment })
        })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    
    updateCommentById(comment_id, inc_votes).then((updatedComment) => {
        res.status(201).send({ comment : updatedComment })
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch((err) => {
        next(err)
    })
}