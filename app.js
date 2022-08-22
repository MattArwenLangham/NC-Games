const apiRouter = require('./routes/api.js')
const express = require("express")
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', apiRouter)

app.use((err, req, res, next) => {
    const { status, msg } = err;
    res.status(status).send({ msg })
})

module.exports = app;