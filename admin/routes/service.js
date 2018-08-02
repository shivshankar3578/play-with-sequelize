var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/services', (req, res, next)=>{
	console.log(`service index called`);
	Service.findAll({
		order:[["id","desc"]],
		include:[{
			model:Bank
		}]
	})
		.then((results)=>{

			res.render('service/index.html', { services: results});
		})
		.catch((err)=>{
			return next(err);
		});

});

router.get('/services/add', (req, res, next)=>{
		Bank.findAll({where:{ status: 1},order:[["bankname","asc"]]})
		.then((results)=>{
			console.log("in get------>",results);
				return res.render('service/add.html', {
				 banks: results,
				 serviceType: defaults.serviceType
			});
		})
		.catch((err)=>{
			return next(err);
		});

})

router.post('/services/add', (req, res, next)=>{
	console.log(`service get called`, req.body);
	var postData =  req.body;

		Service.create(postData, {
			// fields:[]
		})
		.then((result)=>{
			res.redirect('/admin/services/');
		})
		.catch((err)=>{
			return next(err);
		});
})


router.get('/services/edit/:id', (req, res, next)=>{
		console.log(`service edit get called`);

	var data={}
	Service.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((service)=>{
		data.service=service
		data.serviceType= defaults.serviceType
		console.log("service type",data.service);
		return 	Bank.findAll({where:{ status: 1},order:[["bankname","asc"]]})
	})
	.then((banks)=>{
		data.banks=banks
		//console.log("bank type",data.banks);
		return res.render('service/edit.html', data);
	})
	.catch((err)=>{
		return next(err);
	});

})
router.get('/services/view/:id', (req, res, next)=>{
		console.log(`service edit get called`);

	var data={}
	Service.findOne({
		include:[{
			model:Bank
		}],
		 where:{ id: req.params.id}
	})
	.then((service)=>{
		data.service=service
		data.serviceType= defaults.serviceType
		console.log("service type",data.service);
		return 	Bank.findAll({where:{ status: 1},order:[["bankname","asc"]]})
	})
	.then((banks)=>{
		data.banks=banks
		//console.log("bank type",data.banks);
		return res.render('service/view.html', data);
	})
	.catch((err)=>{
		return next(err);
	});

})
router.post('/services/edit/:id', (req, res, next)=>{
	console.log(`service edit post called`, req.body, req.params.id);
	var postData =  req.body;
	FX.uploadFile(req.files.file, dir = 'services', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.cardback = filename
		Service.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/services/');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});
	});

});

router.all('/services/status',(req, res, next)=>{
	console.log('status event called', req.body)
	Service.update(req.body,{
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



router.get('/services/edit/:id', (req, res, next)=>{
		console.log(`users edit get called`);
	Service.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('service/edit.html', {
			 service: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/services/edit/:id', (req, res, next)=>{
	console.log(`service edit post called`, req.body, req.params.id);
	var postData =  req.body;
	Service.update(postData,
			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/services/');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});


});

module.exports = router;
