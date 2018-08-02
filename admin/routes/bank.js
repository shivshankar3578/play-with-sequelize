var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/banks', (req, res, next) => {
	console.log(`bank index called`);
	var where = { },
			render = 'bank/index.html'
	if(req.session.user.userType== 2){
			where = {
				id: req.session.user.bank.id
			}
		render = 'sp-manager/bank/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				id: req.session.user.bank.id,
			}
		render = 'sp-officer/bank/index.html'
	}

	Bank.findAll({
		order:[["id","desc"]],
		where:where
	})
	.then((results) => {
		res.render(render, {
			banks: results
		});
	})
	.catch((err) => {
		return next(err);
	});

});


router.all('/banks/add', (req, res, next) => {
	console.log(`bank add called`, req.body);
	if (req.method == 'GET')
		return res.render('bank/add.html', {
			title: 'Add Bank'
		});

	var postData = req.body;
	postData.created_by = req.session.user.id;
	postData.updated_by = req.session.user.id;

	FX.uploadFile(req.files.cardback, dir = 'banks', thumb = false, (err, filename) => {
		if (err) return next(err)
		if (filename) postData.cardback = filename

		FX.uploadFile(req.files.banklogo, dir = 'banks', thumb = false, (err, filename) => {
			if (err) return next(err)
			if (filename) postData.banklogo = filename

			FX.uploadFile(req.files.frontimage, dir = 'banks', thumb = false, (err, filename) => {
			if (err) return next(err)
			if (filename) postData.frontimage = filename

			Bank.create(postData, {
					// fields:[]
				})
				.then((done) => {
					req.flash('success', 'added successfully');
					res.redirect('/admin/banks/');
				})
				.catch((err) => {
					return next(err);
				});
		});
	});
});
});

router.get('/banks/edit/:id', (req, res, next) => {
	console.log(`bank edit get called`);
	Bank.findOne({
			//  include: [],
			where: {
				id: req.params.id
			}
		})
		.then((result) => {
			return res.render('bank/edit.html', {
				bank: result
			});
		})
		.catch((err) => {
			return next(err);
		});
})

router.post('/banks/edit/:id', (req, res, next) => {
	console.log(`bank edit post called`, req.body, req.params.id);
	var postData = req.body;
	postData.updated_by = req.session.user.id;
	FX.uploadFile(req.files.cardback, dir = 'banks', thumb = false, (err, filename) => {
		if (err) return next(err)
		if (filename) postData.cardback = filename

	FX.uploadFile(req.files.banklogo, dir = 'banks', thumb = false, (err, filename) => {
		if (err) return next(err)
		if (filename) postData.banklogo = filename

	FX.uploadFile(req.files.frontimage, dir = 'banks', thumb = false, (err, filename) => {
		if (err) return next(err)
		if (filename) postData.frontimage = filename

		Bank.update(postData, {
				// fields:[],
				where: {
					id: req.params.id
				}
			})
			.then((done) => {
				//res.send(true)
				req.flash('success', 'updated successfully');
				res.redirect('/admin/banks/');
			})
			.catch((err) => {
				return next(err);
				// testing
			});
		});
	});
});
});

router.all('/banks/status', (req, res, next) => {
	console.log('status event called', req.body)
	var postData = req.body;
	postData.updated_by = req.session.user.id;
	Bank.update(postData, {
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

router.get('/banks/edit/:id', (req, res, next) => {
	console.log(`users edit get called`);
	Bank.findOne({
			//  include: [],
			where: {
				id: req.params.id
			}
		})
		.then((result) => {
			return res.render('bank/edit.html', {
				bank: result
			});
		})
		.catch((err) => {
			return next(err);
		});
})



router.get('/banks/view/:id', (req, res, next) => {
	console.log(`users edit get called`);
	Bank.findOne({
		 include: [{
			 		model: Rate,
			 		include:[{
			 			model:User,
			 			attributes:[ "name"]
			 		}]
			}],
			where: {
				id: req.params.id
			}
		})
		.then((result) => {
			return res.render('bank/view.html', {
				bank: result
			});
		})
		.catch((err) => {
			return next(err);
		});
})

router.post('/banks/edit/:id', (req, res, next) => {
	console.log(`users edit post called`, req.body, req.params.id);
	var postData = req.body;
	Bank.update(postData, {
			// fields:[],
			where: {
				id: req.params.id
			}
		})
		.then((done) => {
			//res.send(true)
			req.flash('success', 'updated successfully');
			res.redirect('/admin/banks/');
		})
		.catch((err) => {
			return next(err);
			// testing
		});
});



module.exports = router;
