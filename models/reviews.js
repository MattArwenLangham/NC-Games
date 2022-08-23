const {retrieveUserByUsername} = require("./users")
const {checkCategoryExists} = require("./categories")

const db = require("../db/connection")
const format = require('pg-format')

exports.fetchReviews = (sort_by = 'created_at', order = 'DESC', category = "category") => {
    const validOrder = ["ASC", "DESC"]
    const validColumns = ["title", "designer", "owner", "category", "created_at", "votes", "ANY"]
    const validCategories = ['strategy', 'hidden-roles', 'dexterity', 'push-your-luck', 'roll-and-write', 'deck-building', 'engine-building', 'category']
    
    if(!validOrder.includes(order)){
        return Promise.reject({status: 400, msg: "Invalid order specified! ('ASC' or 'DESC')"})
    } else if (!validColumns.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Invalid column!'})
    } else if (!validCategories.includes(category)){
        return Promise.reject({status: 400, msg: 'Invalid category!'})
    }

    if (category != 'category'){
        category =`'${category.replace("'", "''")}'`
    }

    return db.query(format(`
        SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE category = %s
        GROUP BY reviews.review_id
        ORDER BY %I %s;
    `, category, sort_by, order))
    .then(({ rows: reviews }) => {
        if(!reviews.length){
            return Promise.reject({status: 404, msg: 'No reviews found!'})
        }

        return reviews
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
    `, [review_id]).then(({ rows: [review] }) => {

        if(!review){
            return Promise.reject({status: 404, msg: 'Review ID does not exist!'})
        }

        return review
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
                return 'No Comments!'
            }
            return comments;
        })
    })
}

exports.updateReview = (review_id, inc_votes) => {
    
    if (!inc_votes){
        return Promise.reject({status: 400, msg: "Invalid property!"})
    } else if (isNaN(parseInt(inc_votes))){
        return Promise.reject({status: 400, msg: "Invalid value!"})
    }

    return this.fetchReviewById(review_id).then(() => {
        return db.query(`
            UPDATE reviews
            SET
                votes = votes + $2
            WHERE review_id = $1
            RETURNING *;
        `, [review_id, inc_votes])
        .then(({rows: [updatedReview]}) => {
            return updatedReview;
        })
    })

}

exports.submitReview = (review) => {
    const {owner, title, designer, review_img_url, review_body, category} = review
    
    Promise.all(
        [retrieveUserByUsername(owner), 
        checkCategoryExists(category)])
    .then(() => {
        return retrieveUserByUsername(owner)
        .then(() => {
            const created_at = new Date (Date.now())
    
            return db.query(`
                INSERT INTO reviews
                    (title, designer, owner, review_img_url, review_body, category, created_at, votes)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, 0)
                    RETURNING *;
            `, [title, designer, owner, review_img_url, review_body, category, created_at])
            .then(({ rows : [review] }) => {
                return review
            })
        })

    })
}