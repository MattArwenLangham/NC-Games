const db = require("../db/connection")

exports.retrieveCategories = () => {
    return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
        return categories;
    })
}