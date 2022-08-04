const apiRouter = require('./routes/api.js')
const express = require("express")

const app = express()

app.use(express.json())
app.use('/api', apiRouter)

app.use((err, req, res, next) => {
    const { status, msg } = err;
    res.status(status).send({ msg })
})

module.exports = app;