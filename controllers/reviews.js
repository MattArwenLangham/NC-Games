const { fetchReviewById, 
        updateReview,
        fetchReviews } = require("../models/reviews")

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews) => {
        res.status(200).send({ reviews })
    })
}

exports.getReviewById = (req, res, next) => {
    const {review_id} = req.params

    fetchReviewById(review_id).then((review) => {
        res.status(200).send({ review })
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body

    updateReview(review_id, inc_votes).then((updatedReview) => {
        res.status(201).send({ review: updatedReview })
    })
    .catch((err) => {
        next(err);
    })
}