const { getEndpoints } = require("../controllers/index");
const categoryRouter = require("./categories")
const commentRouter = require("./comments")
const reviewRouter = require("./reviews")
const userRouter = require("./users")

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpoints)

apiRouter.use('/categories', categoryRouter)
apiRouter.use('/reviews', reviewRouter)
apiRouter.use('/comments', commentRouter)
apiRouter.use('/users', userRouter)

module.exports = apiRouter