const Reward = require("../models/RewardModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Reward Schema
function RewardData(data) {
	this.id = data._id;
	this.ownerName = data.ownerName;
	this.favorType= data.favorType;
	this.otherPersonName = data.otherPersonName;
	this.photo = data.photo;
	this.description = data.description;
	this.status = data.status;
}

/**
 * Reward List.
 * 
 * @returns {Object}
 */
exports.rewardList = [
	auth,
	function (req, res) {
		try {
			Reward.find().then((rewards)=> {
                console.log(rewards);
				if(rewards.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", rewards);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Reward Detail.
 * 
 * @param {string}      ownerName
 * 
 * @returns {Object}
 */
exports.rewardDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params._id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Reward.findOne({_id: req.params._id,user: req.user._id},"_id title description isbn createdAt").then((reward)=>{                
				if(reward !== null){
					let rewardData = new RewardData(reward);
					return apiResponse.successResponseWithData(res, "Operation success", rewardData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * reward store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.rewardStore = [
	auth,
	body("ownerName", "Owner name must not be empty.").isLength({ min: 1 }).trim(),
	body("favorType", "Favor Type must not be empty.").isLength({ min: 1 }).trim(),
	body("otherPersonName", "Other person name must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("status", "Status must not be empty.").isLength({ min: 1 }).trim(),
	
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var reward = new Reward(
                {   
                    ownerName: req.body.ownerName,
                    favorType: req.body.favorType,                    
                    otherPersonName: req.body.otherPersonName,                    
                    description: req.body.description,
                    status: req.body.status
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save reward.
				reward.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let rewardData = new RewardData(reward);
					return apiResponse.successResponseWithData(res,"Reward add Success.", rewardData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Reward update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.rewardUpdate = [
	auth,
	body("ownerName", "Owner name must not be empty.").isLength({ min: 1 }).trim(),
	body("favorType", "Favor Type must not be empty.").isLength({ min: 1 }).trim(),
	body("otherPersonName", "Other person name must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("status", "Status must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var reward = new Reward(
				{ 
                    ownerName: req.body.ownerName,
                    favorType: req.body.favorType,                    
                    otherPersonName: req.body.otherPersonName,                    
                    description: req.body.description,
                    status: req.body.status
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params._id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Reward.findById(req.params._id, function (err, foundReward) {
						if(foundReward === null){
							return apiResponse.notFoundResponse(res,"Reward not exists with this id");
						}else{
							//Check authorized user
							if(foundReward.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update book.
								Reward.findByIdAndUpdate(req.params._id, reward, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let rewardData = new RewardData(book);
										return apiResponse.successResponseWithData(res,"Book update Success.", rewardData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.rewardDelete = [
	auth,
	function (req, res) {
        console.log(req.params)
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Reward.findById(req.params.id, function (err, foundReward) {
				if(foundReward === null){
					return apiResponse.notFoundResponse(res,"Reward not exists with this id");
				}else{
                    //delete reward.
                    Reward.findByIdAndRemove(req.params.id,function (err) {
                        if (err) { 
                            return apiResponse.ErrorResponse(res, err); 
                        }else{
                            return apiResponse.successResponse(res,"Reward delete Success.");
                        }
                    });
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];