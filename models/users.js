const db = require("../db/connection")

exports.retrieveUsers = () => {
    return db.query(`
        SELECT * FROM users;`)
    .then(({ rows: users }) => {
        return users
    })
}

exports.retrieveUserByUsername = (username) => {
    return db.query(`
        SELECT * FROM users
        WHERE users.username = $1;`, [username])
    .then(({ rows: user }) => {
        if(!user.length){
            return Promise.reject({status: 404, msg: "Username doesn't exist"})
        }
        return user
    })
}