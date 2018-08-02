var express = require('express');
var router = express.Router();

var models = require('../../models');



router.all('/pages', (req, res, next)=>{
	console.log(`page index called`);
	Page.findAll({
			order:[["id","desc"]],
	})
		.then((results)=>{
			res.render('page/index.html', { pages: results});
		})
		.catch((err)=>{
			return next(err);
		});

});


router.all('/pages/add', (req, res, next)=>{
	console.log(`page add called`, req.body);
	if(req.method=='GET')
		return res.render('page/add.html', {
			 title: 'Add Page'
		});
	var postData =  req.body;
	postData.created_by = req.session.user.id
	postData.updated_by = req.session.user.id
	Page.create(postData, {
		// fields:[]
	})
	.then((done)=>{
		req.flash('success', 'added successfully');
		res.redirect('/admin/pages');
	})
	.catch((err)=>{
		return next(err);
	});

});

router.get('/pages/edit/:id', (req, res, next)=>{
		console.log(`page edit get called`);
	Page.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('page/edit.html', {
			 page: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})
router.get('/pages/view/:id', (req, res, next)=>{
		console.log(`page edit get called`);
	Page.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('page/view.html', {
			 page: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})
router.post('/pages/edit/:id', (req, res, next)=>{
	console.log(`page edit post called`);
	var postData =  req.body;
	postData.updated_by = req.session.user.id;
	Page.update(postData,
		{
			// fields:[],
			where: {
				id:req.params.id
			}
		})
		.then((done)=>{
			req.flash('success', 'updated successfully');
			res.redirect('/admin/pages');
		})
		.catch((err)=>{
			return next(err);
		});

});




router.all('/pages/view/:id/',(req, res, next)=>{
	Page.findAll({
		 include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('page/view', {
			 viewData: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
});

router.all('/pages/status',(req, res, next)=>{
	//console.log('page status event12345 called', req.body)
	var postData =  req.body;
	postData.updated_by = req.session.user.id;
	Page.update(postData,{
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
