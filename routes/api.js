var express = require("express");
var authRouter = require("./auth");
var leaderRouter = require("./leader")
var rewardRouter = require("./reward");

var app = express();

app.use("/auth/", authRouter);
app.use("/leader/", leaderRouter);
app.use("/reward/", rewardRouter);

module.exports = app;