const {
    categoryControllers: { getCategories }
} = require("./controllers/index");

const express = require("express");
const app = express();

app.get("/api/categories", getCategories);

module.exports = app;