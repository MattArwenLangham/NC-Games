const {
    userControllers: { getUsers }
} = require("../controllers/index")
const userRouter = require('express').Router()

userRouter.get('/', getUsers)

module.exports = userRouter