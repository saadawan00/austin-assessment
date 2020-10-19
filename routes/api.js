var express = require("express");
var authRouter = require("./auth");
var rewardRouter = require("./reward");

var app = express();

app.use("/auth/", authRouter);
app.use("/reward/", rewardRouter);

module.exports = app;