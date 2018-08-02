var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/cards/*', (req, res, next) => {
	Pref.findAll({})
	.then(prefs=>{
		defaults.cardCategory = []
		defaults.network = []
		defaults.targetedUsers = []
		defaults.serviceType = []
		prefs.forEach(v=>{
			if(defaults[v.preference])
				defaults[v.preference].push({id:v.key, name:v.val})
		})
		res.locals.defaults = defaults
		// console.log(defaults.targetedUsers);
		next()
	})
	.catch(err=>{
		return next(err)
	})

})


router.all('/cards', (req, res, next) => {
	console.log(`card index called`);
	var where = { },
			render = 'card/index.html'
	if(req.session.user.userType== 2){
			where = {
				bank_id: req.session.user.bank.id
			}
		render = 'sp-manager/card/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				bank_id: req.session.user.bank.id,
			}
		render = 'sp-officer/card/index.html'
	}

	Card.findAll({
		order:[["id","desc"]],
		include:[{
			model:Bank
		},
		{
			model:User
		},
		{
			model:User,
			as: "updatedBy"
		}],
		where:where,
		order:[["id","desc"]]
	})
	.then((results) => {
			res.render(render, {
				cards: results

			});
		})
		.catch((err) => {
			return next(err);
		});

});


router.get('/cards/add', (req, res, next) => {
		var data={}
	if(req.session.user.userType==1){
			req.body.published_by = req.session.user.id	
			req.body.published_by = req.session.user.id	
			req.body.status = 1	
			req.body.is_created=1	
			req.body.is_published=1	
		}
	Promise.all([
		Bank.findAll({
		where: { status: 1},
		order:[["bankname","asc"]]
		}),
		Reward.findAll({
			where: { status: 1},
			order:[["program_name","asc"]]
		})
	])
	.then((results)=>{
		 data.banks = results[0]
		 data.rewards = results[1]
		 console.log(data.rewards);
		 return res.render('card/add.html', data);
	 })
	.catch((err)=>{
		return next(err);
	});
})

router.post('/cards/add', (req, res, next) => {

	var postData = req.body;
	postData.created_by = req.session.user.id
	postData.updated_by = req.session.user.id
	console.log("postdata", postData);
		FX.uploadFile(req.files.cardback, dir = 'cards', thumb = false, (err, filename) => {
			if (err) return next(err)
			if (filename) postData.cardback = filename

			FX.uploadFile(req.files.frontimage, dir = 'cards', thumb = false, (err, filename) => {
				if (err) return next(err)
				if (filename) postData.frontimage = filename

				Card.create(postData, {
						// fields:[]
				})
				.then((done) => {
					req.flash('success', 'added successfully');
					res.redirect('/admin/cards');
				})
				.catch((err) => {
					return next(err);
				});

			});
		});
});


router.all('/cards/lead_stat',(req, res, next)=>{
	console.log(req.query);
	var fields = ['status']
	var postData  = req.query
	var msg =  'TestApp Application is '
	if(req.query.status == 1){
		fields.push("process_date")
		postData.process_date = new Date()
		msg += ' on process'
	}
	else if(req.query.status == 2){
		fields.push("hold_date")
		postData.hold_date = new Date()
		msg += ' on hold'
	}
	else if(req.query.status == 3){
		fields.push("complete_date")
		postData.complete_date = new Date()
		msg += ' on completed'
	}
	else if(req.query.status == 4){
		fields.push("cancel_date")
		postData.cancel_date = new Date()
		msg += ' on cancelled'
	}


	Promise.all([
		Applycard.update(postData,{
		 fields:fields,
		 where:{ id: req.query.card_id}
		}),

		User.findById(req.query.user_id)
	])
	.then((result)=>{
		var user  =result[1]
		res.redirect('/admin/leads');
		PX.sendPush(user, msg, {} )
	})
	.catch((err)=>{
		return next(err);
	});


});


router.get('/cards/edit/:id', (req, res, next) => {
		var data={}
	console.log(`card edit get called`);
	Card.findOne({
			//  include: [],
			where: {
				id: req.params.id
			}
		})
	.then((card)=>{
		data.card = card.get({plain:true})
		return 	Bank.findAll({
			where:{ 
				status: 1
			},
			order:[["bankname","asc"]]
		})
	})
	.then((banks)=>{
			data.banks = banks
		return Reward.findAll({
				where: {
					status: 1
				},
				order:[["program_name","asc"]]
			})
		})
	.then((rewards)=>{
		 data.rewards = rewards
		return res.render('card/edit.html', data);
	})
		.catch((err) => {
			return next(err);
		});
})

router.get('/cards/view/:id', (req, res, next) => {
		var data={}
	console.log(`card view get called`);
	Card.findOne({
			 include:[{
			model:Bank
		}],
			where: {
				id: req.params.id
			}
		})
	
		.then((card)=>{
		data.card = card.get({plain:true})
		return 	Bank.findAll({where:{ status: 1},order:[["bankname","asc"]]})
	})
	.then((banks)=>{
		data.banks = banks
		return res.render('card/view.html', data);
	})
		.catch((err) => {
			return next(err);
		});
})
	
router.post('/cards/edit/:id', (req, res, next) => {
	console.log(`card edit post called`,req.params.id);

	var postData = req.body;

	FX.uploadFile(req.files.cardback, dir = 'cards', thumb = false, (err, filename) => {
		if (err) return next(err)
		if (filename) postData.cardback = filename

		FX.uploadFile(req.files.frontimage, dir = 'cards', thumb = false, (err, filename) => {
			if (err) return next(err)
			if (filename) postData.frontimage = filename	
			Card.update(postData, {
					// fields:[],
					where: {
						id: req.params.id
					}
				})
			.then((done) => {
				req.flash('success', 'added successfully');
				res.redirect('/admin/cards');
			})
			.catch((err) => {
				return next(err);
				});
		});
	});
});




router.all('/cards/view/:id/', (req, res, next) => {
	Card.findAll({
			include: [],
			where: {
				id: req.params.id
			}
		})
		.then((result) => {
			return res.render('card/view', {
				viewData: result
			});
		})
		.catch((err) => {
			return next(err);
		});
});

router.all('/cards/status', (req, res, next) => {
	//console.log('card status event12345 called', req.body)
	if(req.body.is_published!=undefined)
		req.body.published_by = req.session.user.id			
	req.body.updated_by = req.session.user.id
	Card.update(req.body, {
			//fields:['status'],
			where: {
				id: req.body.id
			}

		})
		.then((result) => {
			return res.send(true)
		})
		.catch((err) => {
			return next(err);
		});
});

/*router.all('/cards/delete/:id', (req, res, next) => {
	console.log('delete event12345 called', req.body)
	Card.destroy({
			//fields:['status'],
			where: {
				id: req.params.id
			},

		})
		.then((result) => {
			res.redirect('/admin/cards');
		})
		.catch((err) => {
			return next(err);
		});
});*/

module.exports = router;
