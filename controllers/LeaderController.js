const Leader = require("../models/LeaderModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Leader Schema
function LeaderData(data) {
	this.names = data._id;
	this.activity= data.activity;
	this.debts = data.debts;
}

/**
 * Leader List.
 * 
 * @returns {Object}
 */
exports.leaderList = [
	auth,
	function (req, res) {
		try {
			Leader.find().then((leader)=>{
				if(leader.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", leader);
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
 * Leader addition.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.leaderStore = [
	auth,
	// body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	// body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("names", "Names must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Leader.findOne({names : value}).then(leader => {
			if (leader) {
				return Promise.reject("Leader already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var leader = new Leader(
				{ names: req.body.names,
					// user: req.user,
					activity: req.body.activity,
					debts: req.body.debts
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save leader.
				leader.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let leaderData = new LeaderData(leader);
					return apiResponse.successResponseWithData(res,"Leader add Success.", leaderData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

// exports.leaderUpdate = [
// 	auth,
// 	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
// 		return Leader.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
// 			if (book) {
// 				return Promise.reject("Leader already exist with this ISBN no.");
// 			}
// 		});
// 	}),
// 	sanitizeBody("*").escape(),
// 	(req, res) => {
// 		try {
// 			const errors = validationResult(req);
// 			var book = new Leader(
// 				{ title: req.body.title,
// 					description: req.body.description,
// 					isbn: req.body.isbn,
// 					_id:req.params.id
// 				});

// 			if (!errors.isEmpty()) {
// 				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
// 			}
// 			else {
// 				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
// 					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
// 				}else{
// 					Leader.findById(req.params.id, function (err, foundBook) {
// 						if(foundBook === null){
// 							return apiResponse.notFoundResponse(res,"Leader not exists with this id");
// 						}else{
// 							//Check authorized user
// 							if(foundBook.user.toString() !== req.user._id){
// 								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
// 							}else{
// 								//update book.
// 								Leader.findByIdAndUpdate(req.params.id, book, {},function (err) {
// 									if (err) { 
// 										return apiResponse.ErrorResponse(res, err); 
// 									}else{
// 										let bookData = new BookData(book);
// 										return apiResponse.successResponseWithData(res,"Leader update Success.", bookData);
// 									}
// 								});
// 							}
// 						}
// 					});
// 				}
// 			}
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];
