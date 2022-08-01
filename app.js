const {
    categoryControllers: { getCategories },
    reviewControllers: { getReviewById, postReview }
} = require("./controllers/index");

const express = require("express");
const app = express();

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById)
app.post("/api/reviews/:review_id", postReview)

app.use((err, req, res, next) => {
    const { status, msg } = err;
    res.status(status).send({ msg })
})

module.exports = app;