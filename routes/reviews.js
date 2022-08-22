const {
    reviewControllers: {
        getReviewById, 
        patchReview, 
        getReviews,
        getCommentsByReviewId,
        postReview },
    commentControllers: {postComment}
} = require("../controllers/index")

const reviewRouter = require('express').Router()

reviewRouter
    .route('/')
    .get(getReviews)
    .post(postReview)

reviewRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReview)

reviewRouter
    .route('/:review_id/comments')
    .get(getCommentsByReviewId)
    .post(postComment)

module.exports = reviewRouter