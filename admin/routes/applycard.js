var express = require('express');
var router = express.Router();

router.all('/leads/', (req, res, next) => {
	console.log(`leads index called`);

	var where = { },
			render = 'applycard/index.html'
	if(req.session.user.userType== 2){
			where = {
				"bank_id": req.session.user.bank.id
			}
		render = 'sp-manager/applycard/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				"bank_id": req.session.user.bank.id,
			}
		render = 'sp-officer/applycard/index.html'
	}


	Applycard.findAll({
		include:[{
			model:Card,
			 include:[{
				model:Bank,
			}],
			where:where
		},
		{
			model:User
		}],
		// where:where,
		order:[["id","desc"]]
	})
	.then((results) => {
		res.render(render, {
			applycards: results
		});
	})
	.catch((err) => {
		return next(err);
	});

});


router.get('/leads/view/:id', (req, res, next) => {
		var data={}
	console.log(`applycard view get called`);
	Applycard.findOne({
			 include:[{
				model:Card,
				 include:[{
					model:Bank
				}]
			},{
				model:User
			}],
		where: {
				id: req.params.id
			}
		})
	.then((applycard)=>{
		data.applycard = applycard
		return res.render('applycard/view.html', data);
	})
	.catch((err) => {
			return next(err);
		});
});
  
module.exports = router;
