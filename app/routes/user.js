var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var { UserInfo } =  require('../../utils/classes');



router.post('/changePassword', (req, res, next)=>{
 var postData = req.body
 var salt = bcrypt.genSaltSync(10);
 bcrypt.compare(postData.oldpassword, req.user.password, function(err, isMatched) {
	if(err) return next(err)

	if(!isMatched)

	return next(new Error(DM.old_password_wrong));     

	User.update({ 
			password: bcrypt.hashSync(postData.password, salt) 
		},
	 {
		 where: {
		 id:req.user.id

		}
	 })
	.then((done)=>{
	
		return res.status(200).json({
			replyCode: "success",
			replyMsg: "password change successfully"
		 });
	
	})
	.catch((err)=>{
	 return next(err);
	});
 });
 
});
	
router.post('/editProfile', (req, res, next)=>{
	var postData =  req.body;
	PX.uploadFileBase64(req.body.profile_image, dir = 'users', thumb=false)
	.then((filename)=>{
		if(filename) postData.profile_image = filename
		User.update(postData, {
			where: {
				id:req.user.id
			},
				// fields:[]
			})
		})
	.then((user)=>{
		if(postData.profile_image) 
			postData.profile_image = baseurl + 'uploads/users/'+ postData.profile_image
		Object.assign(req.user,postData)
		res.status(200).json({
			replyCode: "success",
			data:req.user,
			replyMsg: "Profile update successfully"
		});

	})
	.catch((err)=>{
		return next(err);
	});

});

router.post('/check_eligiblity', (req, res, next)=>{
	var postData =  req.body;
console.log("insert data",postData)
	Enquiry.create(postData, {

		}).then((check)=>{
		res.status(200).json({
			replyCode: "success",
			data:check,
			replyMsg: "insert Sucessful"
		});
	})
	.catch((err)=>{
		return next(err);
	});

});
module.exports = router;
