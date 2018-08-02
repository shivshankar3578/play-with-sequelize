const express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var { UserInfo } =  require('../../utils/classes');
var auth = require('../auth')

router.get('/banks', (req, res, next) => {
	Bank.findAll({where: {status:1}})
		.then((results) => {
		return	res.status(200).json({
				replyCode: "success",
				data: results,
				replyMsg: "banks found"
			});
		})
		.catch((err) => {
			return next(err);
		});
});


router.get('/settings', (req, res, next) => {
	DB.query("select `key` as id, val as name,val_ar as name_ar, preference from prefs   ", (err, results)=>{
		if(err) return next(err)
		return res.status(200).json({
			replyCode: "success",
			data: results,
			replyMsg: "banks found"
		});
	})

});




function evalIn(str) {
	var n = ""
	var arr = str.split(",")
	arr.forEach((v, i)=>{
		n+="'"
		n+=v
		if(arr.length > i+1)
			n+="', "
		else
			n+="' "
	})
	return n
}

router.all('/cards/type/:type', (req, res, next) => {
	var results = []
	var where = ` `
	if(req.body.search)
		where = `and (cardname like '%${req.body.search}%' or card_category like '%${req.body.search}%' or network like '%${req.body.search}%') ` 
	if(filter = req.body.filter){
		if(filter.banks)
			where+= ' and cards.bank_id in ('+evalIn(filter.banks)+') '
		if(filter.type_category)
			where+= ' and card_category in ('+evalIn(filter.type_category)+') '
		if(filter.network)
			where+= ' and network in ('+evalIn(filter.networks)+') '	
	}
	var sql = DB.prepareStmt(	`select cards.*,GROUP_CONCAT(rewards.program_name) as rewards,  banks.*, cards.id as card_id, banks.id as bank_id,"big bazar" as outlets,
		avg(rates.rate) as rate, COALESCE(whishlists.status, 0)  as isFavourited, COALESCE(favourites.status, 0) as iswhished from cards 
		inner join banks on banks.id = cards.bank_id
		left join rates on rates.card_id = cards.id
		left join favourites on favourites.card_id = cards.id and ( favourites.user_id = :user_id and favourites.status=1 )
		left join rewards on FIND_IN_SET(rewards.id, cards.reward_list ) >0
		left join whishlists on whishlists.card_id = cards.id and ( whishlists.user_id = :user_id and whishlists.status=1 )
		where cards.servicetype = :type `+ where	+` group by cards.id order by :order   limit :limit offset :offset `,
		{
				type: req.params.type, user_id : req.user ? req.user.id : 0 ,
				order: req.body.order ?  req.body.order  : ' id desc',
				limit : LPP,
				offset : req.body.page ? parseInt(req.body.page)*LPP : 0,
				user_id: req.user ? req.user.id : 0
		})
	console.log(sql);
	DB.query({sql: sql, nestTables: true})
		.on('error', function(err) {
			return next(err)
		})
		.on('result', function(row) {
			// console.log(`row`, row);
			row.cards.cardback   = baseurl +'uploads/cards/'+ row.cards.cardback;
			row.cards.frontimage   = baseurl +'uploads/cards/'+ row.cards.frontimage;
			row.banks.banklogo   = baseurl +'uploads/banks/'+ row.banks.banklogo
			var tmp = row.cards
			tmp.bank = row.banks
			Object.assign(tmp, row[""])
			results.push(tmp)
		})
		.on('end', function() { 
			res.status(200).json({
				replyCode: "success",
				data: results,
				replyMsg: "cards found"
			});
		});
});


router.get('/cards/:id', (req, res, next) => {
	Card.findAll({
		where:{id:req.params.id,status:1},
		include:[{
			model:Bank
		}]
	})
	.then((results) => {
		res.status(200).json({
			replyCode: "success",
			data: results,
			replyMsg: "cards found"
		});
	})
	.catch((err) => {
		return next(err);
	});
});


router.get('/services', (req, res, next)=>{
	Service.findAll({where:{status:1},
		include:[{
			model:Bank
		}]
	})
	.then((results)=>{
		res.status(200).json({
			replyCode: "success",
			data: results,
			replyMsg: " services found"
		});
	})
	.catch((err)=>{
		next(err);
	});
});


router.post('/forget_password', (req, res, next)=>{
		var postData = req.body
	if(!postData.otp){
		postData.otp =  
			randomString.generate({
				length: 4,
				charset: 'numeric'
			});
		Otp.update(postData,{
				where: {
					email: postData.email
				},
				fields: ["otp"]
			})
		.then((user)=>{
			postData.subject = "TestApp : Forgot Password" 
			if(user.toString() == 0)
				return new Promise((resolve, reject) => {
					reject(new Error(DM.email_not_registered))
				});
			else return PX.sendMail("admin_forgot_password", postData)
		})
		.then((otp)=>{
			return res.status(200).json({
					replyCode: "success",
					replyMsg: "Otp sent to your email. Please check"
			});
		})
		.catch((err)=>{
			return next(err);
		});
	}else{
		// otherwise
		Otp.findOne({
			where:{
				email : postData.email
			}
		})
		.then((otp)=>{
		if(!otp) 
			return new Promise((resolve, reject) => {
				reject(new Error(DM.email_not_registered))
			});
		var otp  = otp.get({plain:true})
		console.log(otp);
		
		if(otp.otp != postData.otp) 
			return new Promise((resolve, reject) => {
				reject(new Error(DM.wrong_otp))
			});
		if(!postData.password) 
			return res.status(200).json({
				replyCode: "success",
				replyMsg: "otp matched successfully"
			});
		User.update({ 
					password: bcrypt.hashSync(postData.password, bcrypt.genSaltSync(10)) 
				},
			 {
				 where: {
				 email:postData.email
				}
			 })
		 })
		.then((done)=>{
			return res.status(200).json({
				replyCode: "success",
				replyMsg: "Password change successfully"
			});
		})
		.catch((err)=>{
			return next(err);
		});
	}
});


router.post('/signup', (req, res, next)=>{
	var postData =  req.body;
	// FX.uploadFile(req.files.file, dir = 'users', thumb=false)
	if(!postData.otp){
		var postData = req.body
		postData.otp =  
			randomString.generate({
				length: 4,
				charset: 'numeric'
			});
		postData.subject = "TestApp : Email Verification" 
		User.findOne({
			where:{
				email : postData.email
			}
		})
		.then((user)=>{
			if(user)
				return new Promise((resolve, reject) => {
					reject(new Error(DM.email_not_registered))
				});
			return	PX.sendMail("admin_forgot_password", postData)
		})
		.then((status)=>{
			return	Otp.upsert(postData, 	{
				default: true,
				fields: ["otp"]
			})
		})
		.then((otp)=>{
			return res.status(200).json({
					replyCode: "success",
					replyMsg: "Otp sent to your email. Please check"
			});
		})
		.catch((err)=>{
			return next(err);
		});
	}
	else
		Otp.findOne({
			where:{
				email : postData.email
			}
		})
		.then((otp)=>{
			if(!otp) 
				return new Promise((resolve, reject) => {
					reject(new Error(DM.email_not_registered))
				});
			var otp  = otp.get({plain:true})
			console.log(otp);
			if(otp.otp != postData.otp) 
				return new Promise((resolve, reject) => {
					reject(new Error(DM.wrong_otp))
				});
		postData.subject = "TestApp : Welcome" 
			return	PX.sendMail('new_registration', postData)
		})
		.then((done)=>{
			// if(filename) postData.profile_image = filename
			return User.create(postData, {
					// fields:[]
				})
			})
		.then((done)=>{
			return User.findById(done.id);
		})
		.then((user)=>{
			user =	user.get({ plain: true})
			user.ssid = FX.crypto(user.id, 'encrypt')
			delete user.password
			res.status(200).json({
				replyCode: "success",
				data:user,
				replyMsg: "signup Sucessful"
			});
		})
		.catch((err)=>{
			return next(err);
		});
});


router.post('/login', (req, res, next)=>{
	var postData = req.body;
	console.log("login called", postData);
	var data = { }
	User.findOne({
		where:{
			email:postData.email
		}
	 })
	.then((user)=>{
		if(!user)
			return next(new Error(DM.user_not_found))
		data.user = user 
		bcrypt.compare(postData.password, user.password, function(err, isMatched) {
			if(err) return next(err)
			if(!isMatched)
				return next(new Error(DM.incorrect_email_password))
			user.device_type = postData.device_type
			user.device_token = postData.device_token
			user.coin = postData.coin
			user.is_arabic = postData.is_arabic
			user =	user.get({ plain: true})
			user.ssid = FX.crypto(user.id, 'encrypt')
			delete user.password
			res.status(200).json({
				replyCode: "success",
				data: user,
				replyMsg: "Login successfully"
			});

			return data.user.save(data.user)
		})
	})
	.then((done)=>{
		console.log(`done`)
	})
	.catch((err)=> {
				return next(err);
	});
});


router.get('/rewards', (req, res, next) => {
	Reward.findAll({where: {status:1}})
		.then((results) => {
			res.status(200).json({
				replyCode: "success",
				data: results,
				replyMsg: "rewards found"
			});
		})
		.catch((err) => {
			return next(err);
		});
});
router.get('/outlets', (req, res, next) => {
	Outlet.findAll({where: {status:1}})
		.then((outlets) => {
			res.status(200).json({
				replyCode: "success",
				data: outlets,
				replyMsg: "outlets found"
			});
		})
		.catch((err) => {
			return next(err);
		});
});


router.get('/rate_review_listing/:card_id', (req, res, next)=>{
	var postData =  req.body;
		Rate.findAll({
			where:{	
				card_id:req.params.card_id,
			}, 
			order:[["id","desc"]],
			include:[{ 
				model:User,
				attributes:["name", "profile_image"]
			}]
		})
	.then((reviews)=>{
			// console.log(reviews);
			if(!reviews.length)
			return	res.status(200).json({
					replyCode: "error",
					replyMsg: DM.no_result_found
				});
			var points  = 0
			 reviews.forEach(v=>{
			 		points += v.rate
			})
			 var rating = points/reviews.length
			res.status(200).json({
				replyCode: "success",
				data:reviews,
				rate : rating,
				replyMsg: "list found"
			});
			
	})
	.catch((err)=>{
		return next(err);
	});
});

router.get('/static/', function(req, res, next) {
	Page.findAll({	attributes:["slug", "title", "title_ar"] })
	.then(data=>{
		res.status(200).json({
			replyCode: "success",
			data:data,
			replyMsg: "list found"
		});
	})
	.catch(err=>{
		next(err)
	})
})

router.get('/static/:slug', function(req, res, next) {
	Page.findOne({
		where:{
			slug:req.params.slug
		}
	})
	.then(content=>{
		res.status(200).json({
			replyCode: "success",
			data:content,
			replyMsg: "data found"
		});

		// res.render('static/basic', { content: req.headers.is_arabic ? content.body_ar : content.body })
	})
	.catch(err=>{
		next(err)
	})

});


router.get('/coins', (req, res, next) => {
	Coin.findAll({
		where: {status:1}
	})
	.then((results) => {
	return	res.status(200).json({
			replyCode: "success",
			data: results,
			replyMsg: "coin found"
		});
	})
	.catch((err) => {
		return next(err);
	});
});


router.get('/prefs', (req, res, next) => {
	Pref.findAll({
		where: {status:1}
	})
	.then((results) => {

		res.status(200).json({
			replyCode: "success",
			data: results,
			replyMsg: "prefs found"
		});
	})
	.catch((err) => {
		return next(err);
	});
});


module.exports = router;
 
 