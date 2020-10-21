var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RewardSchema = new Schema({
	ownerName: {type: String, required: true},
	favorType: {type: String, required: true},
	otherPersonName: {type: String, required: true},
	photo: {type: String, required: false},
	description: {type: String, required: true},
	status: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model("Reward", RewardSchema);