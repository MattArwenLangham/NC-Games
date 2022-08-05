const db = require("../db/connection")

exports.retrieveUsers = () => {
    return db.query(`
        SELECT * FROM users;`)
    .then(({ rows: users }) => {
        return users
    })
}

exports.retrieveUserByUsername = (username) => {
    if(!username){
        return Promise.reject({status: 400, msg: "No username supplied!"})
    }
    
    return db.query(`
        SELECT * FROM users
        WHERE users.username = $1;`, [username])
    .then(({ rows: [user] }) => {
        if(!user){
            return Promise.reject({status: 404, msg: "Username doesn't exist"})
        }
        return user
    })
}