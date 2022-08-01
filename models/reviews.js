const db = require("../db/connection")

exports.fetchReviewById = (review_id) => {
    
    if(isNaN(parseInt(review_id))){
        return Promise.reject({status: 400, msg: 'Invalid review ID type!'})
    }

    return db.query(`
        SELECT * FROM reviews
        WHERE review_id = $1
    `, [review_id]).then(({ rows: review }) => {

        if(!review.length){
            return Promise.reject({status: 404, msg: 'Review ID does not exist!'})
        }

        return review;
    })
}