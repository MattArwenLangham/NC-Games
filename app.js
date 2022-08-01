const {
    categoryControllers: { getCategories },
    reviewControllers: { getReviewById }
} = require("./controllers/index");

const express = require("express");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById)

app.use((err, req, res, next) => {
    const { status, msg } = err;
    res.status(status).send({ msg })
})

module.exports = app;