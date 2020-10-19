var express = require("express");
const RewardController = require("../controllers/RewardController");

var router = express.Router();

router.get("/", RewardController.rewardList);
router.get("/:id", RewardController.rewardDetail);
router.post("/", RewardController.rewardStore);
router.put("/:id", RewardController.rewardUpdate);
router.delete("/:id", RewardController.rewardDelete);

module.exports = router;