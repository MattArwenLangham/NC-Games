const { ident } = require("pg-format");
const db = require("../db/connection")

exports.fetchReviews = () => {
    return db.query(`
        SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at DESC;
    `)
    .then(({ rows: reviews }) => {
        return reviews;
    })
}

exports.fetchReviewById = (review_id) => {

    if(isNaN(parseInt(review_id))){
        return Promise.reject({status: 400, msg: 'Invalid review ID type!'})
    }

    return db.query(`
        SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
    `, [review_id]).then(({ rows: review }) => {

        if(!review.length){
            return Promise.reject({status: 404, msg: 'Review ID does not exist!'})
        }

        return review[0];
    })
}

exports.fetchCommentsByReviewId = (review_id) => {

    return this.fetchReviewById(review_id)
    .then(() => {
        return db.query(`
        SELECT comments.* FROM reviews
        JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1;`, [review_id])
        .then(({ rows: comments }) => {
            if (!comments.length){
                return 'No Comments!';
            }
            return comments;
        })
    })
    .catch((err) => {
        return Promise.reject(err);
    })
}

exports.updateReview = (review_id, inc_votes) => {

    if(isNaN(parseInt(review_id))){
        return Promise.reject({status: 400, msg: 'Invalid review ID type!'})
    } else if (!inc_votes){
        return Promise.reject({status: 400, msg: "Invalid property!"})
    } else if (isNaN(parseInt(inc_votes))){
        return Promise.reject({status: 400, msg: "Invalid value!"})
    }

    return db.query(`
        UPDATE reviews
        SET
            votes = votes + $2
        WHERE review_id = $1
        RETURNING *;
    `, [review_id, inc_votes])
    .then(({rows: updatedReview}) => {

        if(!updatedReview.length){
            return Promise.reject({status: 404, msg: 'Review ID does not exist!'})
        }

        return updatedReview[0];
    })
}