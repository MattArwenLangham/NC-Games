const db = require("../db/connection")

exports.retrieveCategories = () => {
    return db.query(`SELECT * FROM categories`)
    .then(({ rows: categories }) => {
        return categories;
    })
}

exports.checkCategoryExists = (categoryToCheck) => {
    if(!categoryToCheck === undefined){
        return Promise.reject({status: 400, msg: 'Missing category!'})
    }
    return db.query(`
    SELECT * FROM categories
    WHERE slug = $1
    `[categoryToCheck]).then(() => {
        if (!categoryToCheck){
            return Promise.reject({status: 400, msg: 'Invalid category!'})
        }
    })
}