var express = require('express');
var router = express.Router();

var models = require('../../models');


router.all('/rates', (req, res, next) => {
	console.log(`rates index called`);

	var where = { },
			render = 'applycard/index.html'
	if(req.session.user.userType== 2){
			where = {
				"bank_id": req.session.user.bank.id
			}
		render = 'sp-manager/rates/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				"bank_id": req.session.user.bank.id,
			}
		render = 'sp-officer/rates/index.html'
	}


	Rate.findAll({		
		order:[["id","desc"]],
		include:[{
			model:Bank
		},
		{
			model:User
		}],
		where:where
	})
	.then((results) => {
		res.render(render, {
			reviews: results
		});
	})
	.catch((err) => {
		return next(err);
	});

});


module.exports = router;
