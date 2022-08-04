const db = require("../db/connection")

exports.insertComment = (body, review_id, username) => {

    if(!body){
        return Promise.reject({status: 400, msg: "No comment supplied!"})
    }

    return db.query(`
        INSERT INTO comments
            (body, review_id, author)
        VALUES
            ($1, $2, $3)
        RETURNING *;`, [body, review_id, username])
        .then(({ rows: [comment] }) => {
            return comment
        })
}

exports.removeCommentById = (comment_id) => {
    
    if(isNaN(parseInt(comment_id))){
        return Promise.reject({status: 400, msg: 'Invalid comment_id type!'})
    }

    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`, [comment_id])
    .then(({ rows: [commentRemoved]}) => {
        if(!commentRemoved){
            return Promise.reject({status: 404, msg: "Comment not found!"})
        }
    })
}