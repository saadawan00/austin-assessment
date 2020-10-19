var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var rewardRouter = require("./reward");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/reward/", rewardRouter);

module.exports = app;