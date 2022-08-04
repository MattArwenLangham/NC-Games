exports.categoryControllers = require('./categories.js')
exports.reviewControllers = require("./reviews.js")
exports.userControllers = require("./users")
exports.commentControllers = require("./comments")
const endpoints = require("../endpoints.json")

exports.getEndpoints = (req, res) => {
    res.send({endpoints})
}