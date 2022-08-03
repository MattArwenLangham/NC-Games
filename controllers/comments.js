const { insertComment } = require("../models/comments")
const { fetchReviewById } = require("../models/reviews")
const { retrieveUserByUsername } = require("../models/users")

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const {username, body} = req.body;

    Promise.all([fetchReviewById(review_id), retrieveUserByUsername(username)])
    .then(() => {
        return insertComment(body, review_id, username)
        .then((comment) => {
            res.status(201).send({ comment })
        })
    })
    .catch((err) => {
        next(err);
    })
}