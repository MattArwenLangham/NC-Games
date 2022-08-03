const db = require("../db/connection")

exports.insertComment = (body, review_id, username) => {
    
return db.query(`
            INSERT INTO comments
                (body, review_id, author)
            VALUES
                ($1, $2, $3)
            RETURNING *;`, [body, review_id, username])
        .then(({ rows: postedComment }) => {
            return postedComment[0];
        })
}