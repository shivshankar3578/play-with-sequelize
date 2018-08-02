var models = require('../../models');
const sha1 = require('sha1');
const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var admin = require('./admin');

router.all('/admins', (req, res, next)=>{

	User.findAll({
		where:{
			userType:1,
			superadmin:false
		}, 
		order:[["id","desc"]]
	})
	.then((results)=>{
			res.render('admin/index.html', { users: results});
		})
		.catch((err)=>{
			return next(err);
		});

});


router.all('/admins/add', (req, res, next)=>{

	if(req.method=='GET')
		return res.render('admin/add.html', {
			 title: 'Add User'
		});

	var postData =  req.body;
	postData.userType = 1
	postData.created_by = req.session.user.id
	postData.updated_by = req.session.user.id
	FX.uploadFile(req.files.file, dir = 'users', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.profile_image = filename

		User.create(postData, {
			// fields:[]
		})
		.then((result)=>{
			res.redirect('/admin/admins');
		})
		.catch((err)=>{
			return next(err);
		});
	})
});

router.get('/admins/view/:id', (req, res, next)=>{

	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('admin/view.html', {
			 users: result
		});
	})
	.catch((err)=>{
		return next(err);
	});

})

router.get('/admins/edit/:id', (req, res, next)=>{
	
	User.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('admin/edit.html', {
			 users: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})


router.post('/admins/edit/:id', (req, res, next)=>{
	var postData = req.body
	postData.updated_by =  req.session.user.id
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
				 res.redirect('/admin/admins/');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});
	});

});


router.all('/', (req, res, next)=>{
	var data = {}
	var bank = req.session.user.bank
	var whereBankId = bank ? { bank_id : bank.id} : { }
	var whereBank = bank ? { id : bank.id} : { }

	User.count({
		where:{
			userType:0
		}
	})
	.then((usercount)=>{
		data.usercount = usercount

	})
	Card.count({
			where: whereBankId
	})
	.then((cardcount)=>{
		data.cardcount = cardcount

	})
	Bank.count({
			where: whereBank
			
	})
	.then((bankcount)=>{
		data.bankcount = bankcount

	})
	Branch.count({
			where: whereBankId
			
	})
	.then((branchcount)=>{
		data.branchcount = branchcount
		return res.render('index.html', data);
	})

	.catch((err)=>{
		return next(err);
	});
	
	
});


router.all('/logout', (req, res, next)=>{
	console.log("logout called");
	req.session.destroy;
	// Deletes the cookie.
	delete req.session.user;
	res.redirect('/admin/login');
});

router.all('/changePassword', (req, res, next)=>{
	if(req.method=='GET')
		return res.render('admin/change-password.html', {
			 title: 'change password'
		});
	var postData = req.body
	var salt = bcrypt.genSaltSync(10);
	// console.log(postData,req.session.user)

	bcrypt.compare(postData.oldpassword, req.session.user.password, function(err, isMatched) {
		if(err) return next(err)

		if(!isMatched)
			return next(new FlushError("old password not match"))

			User.update({ password: bcrypt.hashSync(postData.password, salt) },
				{
					// fields:[],
					where: {
						id:req.session.user.id
					}
				})
	
				.then((done)=>{
					return User.findById(req.session.user.id)
					
				})
				.then((user)=>{
						req.session.user =  user;
						req.flash('success', 'updated successfully');
						res.redirect('/admin/');
				})
				.catch((err)=>{
					return next(err);
				});
		});
});


router.all('/profile', (req, res, next)=>{
	if(req.method=='GET')
		return res.render('admin/profile.html', {
			 title: 'Login',
			// user: req.session.user
		});
	var postData = req.body
	//req.user.id =req.session.user.id
	FX.uploadFile(req.files.file, dir = 'users', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.profile_image = filename

	User.update(req.body,{
			where: {
				id:req.session.user.id
			}
		})
	.then((done)=>{
			User.findById(req.session.user.id)
			.then((user)=>{
				req.session.user =  user.get({plain:true});
				res.redirect('/admin/profile');
			})
		})
	.catch((err)=>{
			return next(err);
		});
	});
});



module.exports = router;
