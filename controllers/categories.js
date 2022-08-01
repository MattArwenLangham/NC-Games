const {retrieveCategories} = require("../models/categories")

exports.getCategories = (req, res, next) => {

    retrieveCategories().then((categories) => {
        res.status(200).send({categories});
    })
}