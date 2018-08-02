var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var { UserInfo } =  require('../../utils/classes');

router.post('/check_eligibility', (req, res, next)=>{
	var postData =  req.body;

	Enquiry.create(postData, {
	})
	.then((check)=>{
		res.status(200).json({
			replyCode: "success",
			data:check,
			replyMsg: "your application is submitted successfully"
		});
	})
	.catch((err)=>{
		return next(err);
	});

});




router.post('/rate_review', (req, res, next)=>{
	var postData =  req.body;
	Rate.create(postData, {
		})
	.then((check)=>{
			
			Bank.update({ 
				vote_count : sequelize.literal('vote_count+1') ,
				total_votes : sequelize.literal(`total_votes + ${postData.rate}`) 
			}, 
			{ 
				where: {
					id: postData.bank_id
				}
			})
	})
	.then((check)=>{
		res.status(200).json({
			replyCode: "success",
			replyMsg: "Rating successful"
		});
	})
	.catch((err)=>{
		console.log(err);
		return next(err);
	});

});

router.post('/add_remove_whishlist', (req, res, next)=>{
	var postData =   req.body
	Favourite.upsert({
			user_id : req.user.user_id, 
			card_id: postData.card_id,
			status: postData.status
		},
		{
				default: true,
				fields: ["status"]
		})
	.then((fav)=>{
		res.status(200).json({
			replyCode: "success",
			replyMsg: "action successfully"
		});
	})
	.catch((err)=>{
		return console.log(err)
	});

});

router.post('/favCards', (req, res, next)=>{
	var postData =   req.body
	Whishlist.findAll({
			where:{
				user_id : req.user.user_id, 
				status:1,
			},
			include:[
			{
				model:Card,
				include:[
				{
					model:Bank
				}]
			}]
		})
	.then((cards)=>{
		res.status(200).json({
			replyCode: "success",
			data:cards,
			replyMsg: "action successfully"
		});
	})
	.catch((err)=>{
		return console.log(err)
	});

});

router.post('/fav_unfav', (req, res, next)=>{
	var postData =  req.body;
	Whishlist.upsert({
			user_id : req.user.user_id, 
			card_id: postData.card_id,
			status: postData.status
		},
		{
				default: true,
				fields: ["status"]
		})
	.then((whish)=>{
		res.status(200).json({
			replyCode: "success",
			replyMsg: "action successfully"
		});
	})
	.catch((err)=>{
		return next(err);
	});

});

router.post('/apply_card', (req, res, next)=>{
	var postData =  req.body;
	postData.user_id = req.user.id 
	
	Applycard.create(postData, {

	})
	.then((card)=>{
		res.status(200).json({
			replyCode: "success",
			data:card,
			replyMsg: "Thank you for applying"
		});
	})
	.catch((err)=>{
		return next(err);
	});

});

router.post('/my_applications', (req, res, next)=>{
	var postData =  req.body;
	Applycard.findAll({
		include:[{
				model:Card,
				attributes:["cardname", "cardback", "frontimage"],
			include:[{
				model:Bank
			}]
		}],
		where: {
			user_id : req.user.id
		}
	})
	.then((application)=>{
		res.status(200).json({
			replyCode: "success",
			data:application,
			replyMsg: "applications found"
		});
	})
	.catch((err)=>{
		return next(err);
	});

});


module.exports = router;
