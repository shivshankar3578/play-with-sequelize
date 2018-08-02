var express = require('express');
var router = express.Router();

var models = require('../../models');



router.all('/users', (req, res, next)=>{

	User.findAll({
		where:{
			userType:0
		}, 
		order:[["id","desc"]]
	})
	.then((results)=>{
			res.render('user/index.html', { users: results});
		})
		.catch((err)=>{
			return next(err);
		});

});



router.all('/users/add', (req, res, next)=>{

	if(req.method=='GET')
		return res.render('user/add.html', {
			 title: 'Add User'
		});

	var postData =  req.body;
	postData.created_by = req.session.user.id
	postData.updated_by = req.session.user.id
	FX.uploadFile(req.files.file, dir = 'users', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.profile_image = filename

		User.create(postData, {
			// fields:[]
		})
		.then((result)=>{
			res.redirect('/admin/users');
		})
		.catch((err)=>{
			return next(err);
		});
	})
});

router.get('/users/edit/:id', (req, res, next)=>{

	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('user/edit.html', {
			 users: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.get('/users/view/:id', (req, res, next)=>{

	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('user/view.html', {
			 users: result
		});
	})
	.catch((err)=>{
		return next(err);
	});

})


router.post('/users/edit/:id', (req, res, next)=>{

	var postData =  req.body;
	postData.updated_by = req.session.user.id;
	FX.uploadFile(req.files.file, dir = 'users', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.profile_image = filename
		User.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/users');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});
	});

});


router.all('/users/status',(req, res, next)=>{

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





router.get('/users/edit/:id', (req, res, next)=>{

	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('user/edit.html', {
			 users: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/users/edit/:id', (req, res, next)=>{

	var postData =  req.body;
	FX.uploadFile(req.files.file, dir = 'users', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.profile_image = filename
		User.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/users');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});
	});

});

module.exports = router;
