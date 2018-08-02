var express = require('express');
var router = express.Router();

var models = require('../../models');



router.all('/providers', (req, res, next)=>{
	console.log(`provider index called`);
	// use both 1 & 2 pending 
	var where = { userType:2 },
			render = 'provider/index.html'
	if(req.session.user.userType== 2){
			where = {
				bank_id: req.session.user.bank.id,
				userType: 3
			}
		render = 'sp-manager/provider/index.html'
	}

	User.findAll({
		include:[{
			model:Bank
		}],
		where:where,
		order:[["id","desc"]]
	})
		.then((results)=>{
			res.render('provider/index.html', { providers: results});
		})
		.catch((err)=>{
			return next(err);
		});

});

router.get('/providers/add', (req, res, next)=>{

	var results = { }
 	Bank.findAll({
			order:[["bankname","asc"]],
		})
		.then((banks) => {
			results.banks = banks;
			return Branch.findAll({
				order:[["id","desc"]],
				include:[{
					model:Bank
				}]
			})		
		})
		.then((branches) => {
			results.branches =  branches
			res.render('provider/add.html', results);
		})
		.catch((err) => {
			return next(err);
		});

})

router.post('/providers/add', (req, res, next)=>{
	var postData =  req.body;
		postData.userType = 2
	if(req.session.user.userType== 2)
			postData.userType = 3

	User.create(postData, {
		// fields:[]
	})
	.then((done)=>{
		req.flash('success', 'added successfully');
		res.redirect('/admin/providers');
	})
	.catch((err)=>{
		return next(err);
	});

});



router.get('/providers/edit/:id', (req, res, next)=>{
		console.log(`providers edit get called`);
	var results = { }
 	Bank.findAll({
			order:[["bankname","asc"]],
		})
		.then((banks) => {
			results.banks = banks;
			
			 return User.findOne({
				 include: [{
				 	model:Bank
				 }],
				 where:{ id: req.params.id}
			})
	})
	.then((users)=>{
		results.providers = users
		return res.render('provider/edit.html', results);
	})
	.catch((err)=>{
		return next(err);
	});
})

router.get('/providers/view/:id', (req, res, next)=>{
		console.log(`providers edit get called`);
	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('provider/view.html', {
			 providers: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/providers/edit/:id', (req, res, next)=>{
	console.log(`providers edit post called`, req.body, req.params.id);
	var postData =  req.body;
	// FX.uploadFile(req.files.file, dir = 'providers', thumb=false, (err, filename)=>{
	// 	if(err) return next(err)
	// 	if(filename) postData.profile_image = filename
		User.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				req.flash('success', 'updated successfully');
				res.redirect('/admin/providers');
			})
			.catch((err)=>{
				return next(err);
			});
	// });

});




router.all('/providers/view/:id/',(req, res, next)=>{
	User.findOne({
		 //include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('provider/view', {
			 viewData: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
});

router.all('/providers/status',(req, res, next)=>{
	console.log('status event called', req.body)
	User.update(req.body,{
		 //fields:['status'],
		 where:{ id: req.body.id}

	})
	.then((result)=>{
		return  res.send(true)
	})
	.catch((err)=>{
		return next(err);
	});
});
module.exports = router;
