var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/leads/enquiry', (req, res, next) => {
	console.log(`enquiry index called`);

	var where = { },
			render = 'enquiry/index.html'
	if(req.session.user.userType== 2){
			where = {
				"bank_id": req.session.user.bank.id
			}
		render = 'sp-manager/enquiry/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				"bank_id": req.session.user.bank.id,
			}
		render = 'sp-officer/enquiry/index.html'
	}


	Enquiry.findAll({
		include:[{
				model:Card,
				 include:[{
					model:Bank
				}],
			where:where,
			}],
		order:[["id","desc"]]
	})
		.then((results) => {
			res.render('enquiry/index.html', {
				enquiries: results
			});
		})
		.catch((err) => {
			return next(err);
		});

});


// router.all('/enquiry/add', (req, res, next) => {
// // 	console.log(`enquiry add called`, req.body);
// // 	if (req.method == 'GET')
// // 		return res.render('enquiry/add.html', {
// // 			title: 'Add Bank'
// // 		});

// // 	var postData = req.body;
// // 			Enquiry.create(postData, {
// // 					// fields:[]
// // 				})
// // 				.then((done) => {
// // 					req.flash('success', 'added successfully');
// // 					res.redirect('/admin/enquiry/');
// // 				})
// // 				.catch((err) => {
// // 					return next(err);
// // 				});
// // 		});
	

// router.get('/enquiry/edit/:id', (req, res, next) => {
// 	console.log(`enquiry edit get called`);
// 	Enquiry.findOne({
// 			//  include: [],
// 			where: {
// 				id: req.params.id
// 			}
// 		})
// 		.then((result) => {
// 			return res.render('enquiry/edit.html', {
// 				enquiries: result
// 			});
// 		})
// 		.catch((err) => {
// 			return next(err);
// 		});
// })

// router.post('/enquiry/edit/:id', (req, res, next) => {
// 	console.log(`service edit post called`, req.body, req.params.id);
// 	var postData = req.body;
// 	Enquiry.update(postData, {
// 				// fields:[],
// 				where: {
// 					id: req.params.id
// 				}
// 			})
// 			.then((done) => {
// 				//res.send(true)
// 				req.flash('success', 'updated successfully');
// 				res.redirect('/admin/enquiry/');
// 			})
// 			.catch((err) => {
// 				return next(err);
// 				// testing
// 			});
// 		});
	


// router.get('/enquiry/edit/:id', (req, res, next) => {
// 	console.log(`enquiry edit get called`);
// 	Enquiry.findOne({
// 			//  include: [],
// 			where: {
// 				id: req.params.id
// 			}
// 		})
// 		.then((result) => {
// 			return res.render('enquiry/edit.html', {
// 				enquiries: result
// 			});
// 		})
// 		.catch((err) => {
// 			return next(err);
// 		});
// })
// router.get('/enquiry/view/:id', (req, res, next) => {
// 	console.log(`enquiry edit get called`);
// 	Enquiry.findOne({
// 			include:[{
// 			model:Bank
// 		}],
// 			where: {
// 				id: req.params.id
// 			}
// 		})

// 		.then((result) => {
// 			return res.render('enquiry/view.html', {
// 				enquiries: result
// 			});
// 		})
// 		.then((bank) => {
// 			return res.render('enquiry/view.html', {
// 				enquiries: result
// 			});
// 		})
// 		.catch((err) => {
// 			return next(err);
// 		});
// })
router.get('/leads/enquiry/view/:id', (req, res, next) => {
		var data={}
	console.log(`enquiry view get called`);
	Enquiry.findOne({
			 include:[{
				model:Card,
				 include:[{
					model:Bank
				}]
			}],
		where: {
				id: req.params.id
			}
		})
	.then((enquiry)=>{
		data.enquiry = enquiry
		return res.render('enquiry/view.html', data);
	})
	.catch((err) => {
			return next(err);
		});
});
  
// router.post('/enquiry/edit/:id', (req, res, next) => {
// 	console.log(`enquiry edit post called`, req.body, req.params.id);
// 	var postData = req.body;
// 	Enquiry.update(postData, {
// 			// fields:[],
// 			where: {
// 				id: req.params.id
// 			}
// 		})
// 		.then((done) => {
// 			//res.send(true)
// 			req.flash('success', 'updated successfully');
// 			res.redirect('/admin/enquiry/');
// 		})
// 		.catch((err) => {
// 			return next(err);
// 			// testing
// 		});
// });



module.exports = router;
