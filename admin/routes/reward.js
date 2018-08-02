var express = require('express');
var router = express.Router();
var striptags = require('striptags');
var models = require('../../models');



router.all('/rewards', (req, res, next)=>{
	console.log(`reward index called`);

	var where = { },
			render = 'reward/index.html'
	if(req.session.user.userType== 2){
			where = {
				created_by: req.session.user.id
			}
		render = 'sp-manager/reward/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				created_by: req.session.user.id,
			}
		render = 'sp-officer/reward/index.html'
	}


	Reward.findAll({
		// where:{ status: 1},
		order:[["id","desc"]],
		where:where
	})
	.then((results)=>{
		res.render(render, { rewards: results});
	})
	.catch((err)=>{
		return next(err);
	});

});

router.get('/rewards/add', (req, res, next) => {
	Outlet.findAll({
		where:{ status: 1},
		order:[["name","asc"]]
	})
	.then((outlet)=>{
			return res.render('reward/add.html', {
			 outlets: outlet,
			 title: 'Add User',		     
		});
	})
	.catch((err)=>{
		return next(err);
	});

})

router.post('/rewards/add', (req, res, next)=>{	
	var postData =  req.body;
	if(req.session.user.userType== 3)
		 postData.status = 0 
	postData.created_by = req.session.user.id;
	postData.updated_by = req.session.user.id;
			Reward.create(postData, {
			// fields:[]
		})
		.then((result)=>{
			res.redirect('/admin/rewards');
		})
		.catch((err)=>{
			return next(err);
		});
	
});

router.get('/rewards/edit/:id', (req, res, next)=>{
var data={}
    Outlet.findAll({
    	// where:{ status: 1},
    	order:[["name","asc"]]
    })
	.then((outlet)=>{
			data.outlets = outlet			
	})	
	Reward.findOne({
		//  include: [],
		 where:{ id: req.params.id,
		 	status: 1

		 }
	})
	.then((rewards)=>{			
		data.rewards = rewards
		return res.render('reward/edit.html', data);
	})
	.catch((err)=>{
		return next(err);
	});
})

router.get('/rewards/view/:id', (req, res, next)=>{

	Reward.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('reward/view.html', {
			 rewards: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/rewards/edit/:id', (req, res, next)=>{

	var postData =  req.body;
	postData.updated_by = req.session.user.id;
		Reward.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/rewards');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});

});


router.all('/rewards/status',(req, res, next)=>{
	var postData =  req.body;
	postData.updated_by = req.session.user.id;
	Reward.update(postData,{
		 fields:['status'],
		 where:{ id: req.body.id}

	})
	.then((result)=>{
		return  res.send(true)
	})
	.catch((err)=>{
		return next(err);
	});
});

router.get('/rewards/edit/:id', (req, res, next)=>{

	Reward.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('reward/edit.html', {
			 rewards: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/rewards/edit/:id', (req, res, next)=>{

	var postData =  req.body;
		Reward.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/rewards');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});

});

module.exports = router;
