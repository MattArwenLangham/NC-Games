const {
    categoryControllers: { getCategories },
    reviewControllers: { getReviewById, patchReview, getReviews,getCommentsByReviewId },
    userControllers: { getUsers },
    commentControllers: { postComment }
} = require("./controllers/index");

const express = require("express");
const app = express();

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById)
app.patch("/api/reviews/:review_id", patchReview)
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)
app.post("/api/reviews/:review_id/comments", postComment)

app.get("/api/users", getUsers)

app.use((err, req, res, next) => {
    const { status, msg } = err;
    res.status(status).send({ msg })
})

module.exports = app;