var express = require('express');
var router = express.Router();

var models = require('../../models');

router.post('/ajax/delete',(req, res, next)=>{
	console.log(req.body);
	models[req.body.model].destroy({
		 where:{ id: req.body.ids.split(",")},

	})
	.then((result)=>{
		return res.status(200).json({
			status:true
		});
	})
	.catch((err)=>{
		return res.status(500).json({
			status:false
		});
	});
});

router.post('/ajax/chngstatus',(req, res, next)=>{
	console.log(req.body);
	models[req.body.model].update({
			status: req.body.status
		},
		{
		 	where:{ id: req.body.ids.split(",")},

	})
	.then((result)=>{
		return res.status(200).json({
			status:true
		});
	})
	.catch((err)=>{
		return res.status(500).json({
			status:false
		});
	});
});


router.all('/ajax/status',(req, res, next)=>{

	models[req.body.model].update({
			status: req.body.status
		},
		{
		 //fields:['status'],
			where:{ id: req.body.ids}

	})
	.then((result)=>{
			
		return res.status(200).json({
			status:true
		});

	})
	.catch((err)=>{
		return res.status(500).json({
			status:false
		});
	});
});




module.exports = router;
