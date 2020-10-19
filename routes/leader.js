var express = require("express");
const LeaderController = require("../controllers/LeaderController");

var router = express.Router();

router.get("/", LeaderController.leaderList);
// router.get("/:id", BookController.bookDetail);
router.post("/", LeaderController.leaderStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;