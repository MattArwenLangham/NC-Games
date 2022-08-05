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

exports.fetchCommentById = (comment_id) => {

    if(isNaN(parseInt(comment_id))){
        return Promise.reject({status: 400, msg: 'Invalid comment ID type!'})
    }

    return db.query(`
            SELECT * FROM comments
            WHERE comment_id = $1;
        `, [comment_id])
        .then(({rows: [comment]}) => {
            if(!comment){
                return Promise.reject({status: 404, msg: "Comment not found!"})
            }
            
            return comment;
        })
}

exports.updateCommentById = (comment_id, inc_votes) => {
    
    if (!inc_votes){
        return Promise.reject({status: 400, msg: "Invalid property!"})
    } else if (isNaN(parseInt(inc_votes))){
        return Promise.reject({status: 400, msg: "Invalid value!"})
    }

    return this.fetchCommentById(comment_id).then(() => {
        return db.query(`
            UPDATE comments
            SET
                votes = votes + $2
            WHERE comment_id = $1
            RETURNING *;
        `, [comment_id, inc_votes])
        .then(({rows: [updatedComment]}) => {
            return updatedComment;
        })
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