var express = require('express');
var router = express.Router();
const request = require('request')
var models = require('../../models');
const reqPromise = require('request')

router.all('/branches/*', (req, res, next) => {
	Bank.findAll({
		where:{ 
			status: 1
		},
		order:[["bankname","asc"]]
	})
	.then(banks=>{
		res.locals.banks = banks
		next()
	})
	.catch(err=>{
		next(err)
	})
})


router.all('/branches/*', (req, res, next) => {
	Pref.findAll({})
	.then(prefs=>{
		defaults.cardCategory = []
		defaults.network = []
		defaults.targetedUsers = []
		defaults.serviceType = []
		prefs.forEach(v=>{
			if(defaults[v.preference])
				defaults[v.preference].push({id:v.key, name:v.val})
		})
		res.locals.defaults = defaults
		// console.log(defaults.targetedUsers);
		next()
	})
	.catch(err=>{
		return next(err)
	})

})



function downloadFile(data){
	request(data.logo)
	.on('response',(stream)=>{
		 target = path.join(UPLOAD_PATH, 'branches', data.place_id+'.jpg');
			stream.pipe(fs.createWriteStream(target));
	})
	.on('error', function (e) {
	    console.log(e);
});

}

router.post('/branches/fromGoogle/:token*?', (req, res, next)=>{
	try{
		data = JSON.parse(req.body.data)
	}catch(e){
		return next(e)
	}

	if(!data.length)
		return	res.redirect('/admin/branches');

	console.log(`data`,data);
	data.forEach(place=>{
		try {
			console.log("###", logo);
			var host = url.parse(place.logo).hostname.toString()
			downloadFile(place)
			place.logo = place.place_id+'.jpg' 
		} catch (e) {
				console.log("defaults.png is here");
		}
	})


	Branch.bulkCreate(data, {fields:["name", "place_id", "address", "logo", "latitude", "longitude"] } )
	.then(done=>{
		req.flash('success', 'added successfully');
		setInterval(function() {
			res.redirect('/admin/branches');
		}, 2000);
	})
	.catch(err=>{
		next(err)
	})

})


router.get('/branches/fromGoogle', (req, res, next)=>{
		console.log(req.query);
	var search = req.query.search
	if(!search)
		return res.render('branch/googleSearch.html')

	console.log(`sssssssss`,req.query.search);
	var bankname = search.split(',')[0]
	var bank_id = search.split(',')[1]
	var query ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=24.697252,46.723209&radius=50000&keyword='+bankname+'&key='+process.env.placeKey
	// console.log(query);
	request(query, function(err, result){
		if(err) return next(err)
		var branches = JSON.parse(result.body).results
		// console.log(branches);
		if(!branches) return next(new Error("Noting found"))
		branches.forEach(v=>{
			if(v.photos)
				v.photos[0].photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ v.photos[0].photo_reference+'&key=AIzaSyAMEAOyT-Ig64KyIyAYNfcMVNpHmkIdS7A'
		})
		// console.log(JSON.stringify(branches))
		 
		var branches = require('../sample.json')
		branches = 	[branches[0]]
		var place_ids = []
		branches = branches.map(v=>{
			place_ids.push(v.place_id)
			return { 
				bank_id: bank_id,
				name: v.name,
				address: v.vicinity,
				place_id: v.place_id,
				logo : v.photos? v.photos[0].photo : 'defaults.png',
				latitude: v.geometry.location.lat,
				longitude: v.geometry.location.lng
			}
		})	
		console.log(`place_ids`,place_ids);
		Branch.findAll({
			where:{
				place_id: { $in : place_ids}
			}
		})
		.then(dbrecords=>{
			console.log(`dbrecords`,dbrecords);
			branches = branches.filter(branch=>{
				if(dbrecords.some(dbrecord=>{
					if(dbrecord.place_id == branch.place_id) return true
				}))	return false
				else
					return true
			})
			// console.log(`branches`,branches);
			res.render('branch/fromGoogle.html', {
				branches :branches
			});

		})
		.catch(err=>{
			next(err)
		})
	})

})


router.all('/branches', (req, res, next) => {
	console.log(`branch index called`);
	var where = { },
			render = 'branch/index.html'
	if(req.session.user.userType== 2){
			where = {
				bank_id: req.session.user.bank.id
			}
		render = 'sp-manager/branch/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				bank_id: req.session.user.bank.id,
			}
		render = 'sp-officer/branch/index.html'
	}

	Branch.findAll({
		order:[["id","desc"]],
		include:[{
			model:Bank
		}],
		where:where,
	})
		.then((results) => {
			res.render(render, {
				branches: results
			});
		})
		.catch((err) => {
			return next(err);
		});

});

router.get('/branches/add', (req, res, next) => {
	Bank.findAll({
		where:{ status: 1}
	})
	.then((branch)=>{
			return res.render('branch/add.html', {
			 banks: branch,
			 serviceType: defaults.serviceType
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/branches/add', (req, res, next) => {

	var postData = req.body;
	if(req.session.user.userType== 3)
		 postData.status = 0 
	postData.created_by = req.session.user.id;
	postData.updated_by = req.session.user.id;
	console.log("postdata", postData);
	FX.uploadFile(req.files.logo, dir = 'branches', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.logo = filename
		Branch.create(postData, {
				// fields:[]
			})
		.then((done) => {
			req.flash('success', 'added successfully');
			res.redirect('/admin/branches');
		})
		.catch((err) => {
			return next(err);
			});
	});

});

router.get('/branches/edit/:id', (req, res, next) => {
		var data={}
	console.log(`branches edit get called`);
	Branch.findOne({
			//  include: [],
			where: {
				id: req.params.id
			}
		})
		.then((branch)=>{
		data.branch = branch.get({plain:true})
		data.serviceType= defaults.serviceType
		return Bank.findAll({
			where:{ status: 1},
			order:[["bankname","asc"]]
		})
	})
	.then((banks)=>{
		data.banks = banks
		return res.render('branch/edit.html', data);
	})
		.catch((err) => {
			return next(err);
		});
})

router.get('/branches/view/:id', (req, res, next) => {
		var data={}
	console.log(`branches view get called`);
	FX.uploadFile(req.files.logo, dir = 'branches', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.logo = filename
		Branch.findOne({
				include:[{
				model:Bank
			}],
				where: {
					id: req.params.id
				}
			})
			.then((branch)=>{
			data.branch = branch.get({plain:true})
			return 	Bank.findAll({where:{ status: 1},order:[["bankname","asc"]]})
		})
		.then((banks)=>{
			data.banks = banks
			return res.render('branch/view.html', data);
		})
		.catch((err) => {
			return next(err);
		});
	});
})

router.post('/branches/edit/:id', (req, res, next) => {

	var postData = req.body;
	postData.updated_by = req.session.user.id;
	Branch.update(postData, {
			// fields:[],
			where: {
				id: req.params.id
			}
		})
		.then((done) => {
			req.flash('success', 'added successfully');
			res.redirect('/admin/branches');
		})
		.catch((err) => {
			return next(err);
		});

});
router.all('/branches/status',(req, res, next)=>{

	Branch.update(req.body,{
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
