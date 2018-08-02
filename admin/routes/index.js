var express = require('express');
var router = express.Router();
var models = require('../../models');
const sha1 = require('sha1');
const bcrypt = require('bcrypt');
//	all below routes not require any authentication

router.all('/login', (req, res, next)=>{
	if(req.method=='GET')
		return res.render('login.html', {
			 title: 'Login'
		});

	var postData = req.body;
	console.log("login called", postData);
	User.findOne({
		include:[{
				model: Bank
		}],
		where:{
			email:postData.email,
		}
	 })
	.then((user)=>{
		if(!user)
			return next(new FlushError("user not found"))

		if(!user.status)
			return next(new FlushError("Account is deactivated by Admin "))

		bcrypt.compare(postData.password, user.password, function(err, isMatched) {
			if(err) return next(err)

			if(!isMatched)
				return next(new FlushError("Invalid username or password"))

				req.session.regenerate(function() {
				req.session.user =  user;
				 req.flash('success', 'welcome')
				 if(user.userType!=1) 
				 		return next()
				else 
					return res.redirect('/admin/')
			
			})

		})
	})
	.catch((err)=> {
				return next(err);
	});
}, (req, res, next)=>{
	var user = req.session.user
	if(user.bank) res.locals.bank = user.bank
	if(!user.bank.status)
		return next( new Error("Account associate bank is temporary authorized"))
	if(user.userType==2)   
		return res.redirect('/admin/')
	else if(user.userType==3)   
		return res.redirect('/admin/')
	else
		return next( new Error("You are not authorized"))


});


router.all('/forgotpassword', (req, res, next)=>{
	if(req.method=='GET')
		return res.render('admin/forgot-password.html', {
			 title: 'Login'
		});
		var postData = req.body
		var password = randomString.generate({
			length: 6,
			charset: 'alpha-numeric'
		});
		postData.password = password
		postData.subject = 'Forgot Password'
		FX.sendMail("admin_forgot_password", postData, (err, responseStatus)=> {
			if(err) return next(err)
			var salt = bcrypt.genSaltSync(10);
	User.update({ password: bcrypt.hashSync(postData.password, salt) },
			{
					where: {
						email:postData.email
					}
				})
			.then((done)=>{
				req.flash('success', 'updated successfully');
				res.redirect('/admin/login');
			})
			.catch((err)=>{
				return next(err);
			});
		});
});


module.exports = router;
