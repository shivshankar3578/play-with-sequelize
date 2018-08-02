var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/coins/add', (req, res, next) => {
	console.log(`coins add called`, req.body);
	if (req.method == 'GET')
		return res.render('coin/add.html', {
			
		});

		var postData = req.body;
		postData.created_by = req.session.user.id
		postData.updated_by = req.session.user.id
		Coin.create(postData, {
				// fields:[]
			})
			.then((done) => {
				req.flash('success', 'added successfully');
				res.redirect('/admin/coins/');
			})
			.catch((err) => {
				return next(err);
			});
	});
	
	
router.get('/coins/edit/:coin_id', (req, res, next) => {
		Coin.findById(req.params.coin_id)
			.then((coin) => {
				 res.render('coin/edit.html', {
					coin:coin
				});
			})
			.catch((err) => {
				return next(err);
			});
	});


router.post('/coins/edit/:coin_id', (req, res, next) => {
		var postData = req.body
		postData.updated_by = req.session.user.id
		Coin.update(postData, {
			where:{
				id:req.params.coin_id
			}
		})
			.then((coin) => {
				req.flash('success', 'updated successfully');
				res.redirect('/admin/coins/');
			})
			.catch((err) => {
				return next(err);
			});
	});


router.all('/coins', (req, res, next)=>{
	console.log(`coins index called`);
	Coin.findAll({
		//where:{ status: 1},
		order:[["id","desc"]],

	})
		.then((results)=>{
			res.render('coin/index.html', { coins: results});
		})
		.catch((err)=>{
			return next(err);
		});

});




module.exports = router;
