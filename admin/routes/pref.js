var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/prefs/add', (req, res, next) => {
	console.log(`pref add called`, req.body);
	if (req.method == 'GET')
		return res.render('pref/add.html', {
			preferences: defaults.preferences
		});

	var postData = req.body;
	postData.created_by = req.session.user.id;
	postData.updated_by = req.session.user.id;

	FX.uploadFile(req.files.file, dir = 'prefs', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.icon = filename

		Pref.create(postData, {
			// fields:[]
		})
		.then((done) => {
			req.flash('success', 'added successfully');
			res.redirect('/admin/prefs/');
		})
		.catch((err) => {
			return next(err);
		});

	});
});
	
	
router.get('/prefs/edit/:pref_id', (req, res, next) => {

		Pref.findById(req.params.pref_id)
		.then((pref) => {
			 res.render('pref/edit.html', {
				preferences: defaults.preferences,
				pref:pref
			});
		})
		.catch((err) => {
			return next(err);
		});

});


router.post('/prefs/edit/:pref_id', (req, res, next) => {


	var postData = req.body;
	FX.uploadFile(req.files.file, dir = 'prefs', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.icon = filename
		postData.updated_by = req.session.user.id;

		Pref.update(req.body, {
			where:{
				id:req.params.pref_id
			}
		})
		.then((pref) => {
			req.flash('success', 'updated successfully');
			res.redirect('/admin/prefs/');
		})
		.catch((err) => {
			return next(err);
		});
	});
	
});


router.all('/prefs', (req, res, next)=>{
	console.log(`pref index called`);
	Pref.findAll({
		//where:{ status: 1},
		order:[["id","desc"]],

	})
		.then((results)=>{
			res.render('pref/index.html', { prefs: results});
		})
		.catch((err)=>{
			return next(err);
		});

});




module.exports = router;
