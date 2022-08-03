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
            return comment;
        })
}