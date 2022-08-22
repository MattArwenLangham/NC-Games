const { fetchReviewById, 
        updateReview,
        fetchReviews,
        fetchCommentsByReviewId,
        submitReview } = require("../models/reviews")

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query
    fetchReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getReviewById = (req, res, next) => {
    const {review_id} = req.params

    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params;
    
    fetchCommentsByReviewId(review_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body
    
    updateReview(review_id, inc_votes).then((updatedReview) => {
        res.status(201).send({ review: updatedReview })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postReview = (req, res, next) => {
    const review = req.body
    
    submitReview(review).then((review) => {
        res.status(201).send({ review })
    })
    .catch((err) => {
        next(err)
    })
}