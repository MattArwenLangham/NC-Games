const {
    userControllers: { getUsers, getUserByUsername }
} = require("../controllers/index")
const userRouter = require('express').Router()

userRouter.get('/', getUsers)

userRouter.get('/:username', getUserByUsername)

module.exports = userRouter