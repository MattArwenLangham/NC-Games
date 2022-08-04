const {categoryControllers: { getCategories }} = require("../controllers/index")

const categoryRouter = require('express').Router()

categoryRouter.get('/', getCategories)

module.exports = categoryRouter;