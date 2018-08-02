var express = require('express');
var router = express.Router();
const request = require('request')
var models = require('../../models');
const reqPromise = require('request')
const url = require('url')

router.all('/outlets', (req, res, next)=>{
	console.log(`outlets index called`);
	var where = { },
			render = 'outlet/index.html'
	if(req.session.user.userType== 2){
			where = {
				created_by: req.session.user.id
			}
		render = 'sp-manager/outlet/index.html'
	}
	if(req.session.user.userType== 3){
			where = {
				created_by: req.session.user.id,
			}
		render = 'sp-officer/outlet/index.html'
	}

	Outlet.findAll({
			order:[["id","desc"]],
			where:where
	})
		.then((results)=>{
			res.render(render, { outlets: results});
		})
		.catch((err)=>{
			return next(err);
		});

});




function downloadFile(data){
	request(data.logo)
	.on('response',(stream)=>{
		 target = path.join(UPLOAD_PATH, 'outlets', data.place_id+'.jpg');
			stream.pipe(fs.createWriteStream(target));
	})
	.on('error', function (e) {
	    console.log(e);
});

}

router.post('/outlets/fromGoogle/:token*?', (req, res, next)=>{
	try{
		data = JSON.parse(req.body.data)
	}catch(e){
		return	next(e)
	}

	if(!data.length)
		return res.redirect('/admin/outlets');

	console.log(data);
	data.forEach(place=>{
		try {
			// console.log("###", logo);
			var host = url.parse(place.logo).hostname.toString()
			downloadFile(place)
			place.logo = place.place_id+'.jpg' 
		} catch (e) {
				console.log("defaults.png is here");
				return next(e)
		}
	})


	Outlet.bulkCreate(data, {fields:["name", "place_id", "address", "logo", "latitude", "longitude"] } )
	.then(done=>{
		req.flash('success', 'added successfully');
		setInterval(function() {
			res.redirect('/admin/outlets');
		}, 2000);
	})
	.catch(err=>{
		next(err)
	})

})


router.get('/outlets/fromGoogle', (req, res, next)=>{
	if(!req.query.search)
		return res.render('outlet/googleSearch.html')

	var query ='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=24.697252,46.723209&radius=50000&keyword='+req.query.search+'&key='+process.env.placeKey
	console.log(query);
	request(query, function(err, result){
		if(err) return next(err)
		var outlets = JSON.parse(result.body).results
		// console.log(outlets);
		if(!outlets) return
		outlets.forEach(v=>{
			if(v.photos)
				v.photos[0].photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ v.photos[0].photo_reference+'&key=AIzaSyAMEAOyT-Ig64KyIyAYNfcMVNpHmkIdS7A'
		})
		// console.log(JSON.stringify(outlets))
		 
		
		// var outlets = require('../sample.json')
		// outlets = 	[outlets[0]]
		var place_ids = []
		outlets = outlets.map(v=>{
			place_ids.push(v.place_id)
			return { 
				name: v.name,
				address: v.vicinity,
				place_id: v.place_id,
				google_map_location: v.vicinity,
				logo : v.photos? v.photos[0].photo : 'defaults.png',
				latitude: v.geometry.location.lat,
				longitude: v.geometry.location.lng
			}
		})	

		Outlet.findAll({
			where:{
				place_id: { $in : place_ids}
			}
		})
		.then(dbrecords=>{

			outlets = outlets.filter(outlet=>{
				if(dbrecords.some(dbrecord=>{
					if(dbrecord.place_id == outlet.place_id) return true
				}))	return false
				else
					return true
			})

			res.render('outlet/fromGoogle.html', {
				outlets :outlets
			});

		})
		.catch(err=>{
			next(err)
		})
	})

})

// router.all('/outlets/fromGoogle/:token*?', (req, res, next)=>{

// 	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=23.0285,72.5590&radius=50000&type=bank&keyword=hdfc&key='+process.env.placeKey, function(err, result){
// 		if(err) return next(err)
// 		var data = JSON.parse(result.body).results
// 		// console.log(data);
// 		if(!data) return
// 		data.forEach(v=>{
// 			if(v.photos)
// 				v.photos[0].photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ v.photos[0].photo_reference+'&key=AIzaSyAMEAOyT-Ig64KyIyAYNfcMVNpHmkIdS7A'
// 		})
// 		console.log(JSON.stringify(data))
// 		res.render('outlet/fromGoogle.html', {
// 			 outlets: data
// 		});


// 	})
// })

router.all('/outlets/add', (req, res, next)=>{

	if(req.method=='GET')
		return res.render('outlet/add.html', {
			 title: 'Add Outlet'
		});

	var postData =  req.body;
	if(req.session.user.userType== 3)
		 postData.status = 0 
	postData.created_by = req.session.user.id;
	postData.updated_by = req.session.user.id;
	console.log("postdata", postData);
	FX.uploadFile(req.files.logo, dir = 'outlets', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.logo = filename

			Outlet.create(postData, {
			// fields:[]
		})
		.then((result)=>{
			req.flash('success', 'added successfully');
			res.redirect('/admin/outlets');
		})
		.catch((err)=>{
			return next(err);
		});
	
});
});

router.get('/outlets/edit/:id', (req, res, next)=>{

	Outlet.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('outlet/edit.html', {
			 outlets: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.get('/outlets/view/:id', (req, res, next)=>{
		console.log(`outlets view get called`);
	Outlet.findOne({
		//  include: [],
		 where:{ id: req.params.id}
	})
	.then((result)=>{
		return res.render('outlet/view.html', {
			 outlets: result
		});
	})
	.catch((err)=>{
		return next(err);
	});
})

router.post('/outlets/edit/:id', (req, res, next)=>{

	var postData =  req.body;
		postData.updated_by = req.session.user.id;
	FX.uploadFile(req.files.logo, dir = 'outlets', thumb=false, (err, filename)=>{
		if(err) return next(err)
		if(filename) postData.logo = filename
		Outlet.update(postData,

			{
				// fields:[],
				where: {
					id:req.params.id
				}
			})
			.then((done)=>{
				//res.send(true)
				 req.flash('success', 'updated successfully');
				 res.redirect('/admin/outlets');
			})
			.catch((err)=>{
				return next(err);
			// testing
			});

});
});

router.all('/outlets/status',(req, res, next)=>{
	var postData =  req.body;
		postData.updated_by = req.session.user.id;
	Outlet.update(postData,{
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


router.all('/outlets/delete/:id',(req, res, next)=>{

	Outlet.destroy({
		 //fields:['status'],
		 where:{ id: req.params.id},

	})
	.then((result)=>{
	res.redirect('/admin/outlets');
	})
	.catch((err)=>{
		return next(err);
	});
});

module.exports = router;
