var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LeaderSchema = new Schema({
	names: {type: String, required: true},
	activity: {type: String, required: true},
	debts: {type: String, required: true},
	// user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Leader", LeaderSchema);