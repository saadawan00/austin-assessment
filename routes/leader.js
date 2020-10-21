var express = require("express");
const LeaderController = require("../controllers/LeaderController");

var router = express.Router();

router.get("/", LeaderController.leaderList);
router.post("/", LeaderController.leaderStore);

module.exports = router;