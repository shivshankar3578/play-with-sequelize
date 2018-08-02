const EmailTemplate = require('email-templates').EmailTemplate;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
		from: process.env.SMTP_FROM,
		host: process.env.SMTP_HOST, // hostname
		service: process.env.SMTP_SERVICE,
		auth: {
				user: process.env.SMTP_AUTH_USER,
				pass: process.env.SMTP_AUTH_PASS
		}
});


module.exports = {
		hashPasswordHook : function(instance) {
			// console.info(`hook called`,instance.get('password'));
			if (!instance.changed('password')) return
			var salt = bcrypt.genSaltSync(10);
			instance.password = bcrypt.hashSync(instance.get('password'), salt)
		},

		// hashPasswordHook : function(instance, done) {
		// 	console.log(`hook called`);
		// 	if (!instance.changed('password')) return
		// 	return new Promise(function (resolve, reject) {
		// 		var salt = bcrypt.genSaltSync(SALT_FACTOR);
		// 		bcrypt.hash(instance.get('password'), salt, (err, hash)=> {
		// 			if (err) reject(err)
		// 			else resolve(hash)
		// 		})
		// 	}).then(function (hash) {
		// 		instance.password = hash
		// 	})
		// },
		uploadFile: function(file, label, thumb, cb){
			 console.log("uploadFile called", file);
			 if(!file || !label)  return cb(null, null);
			 console.log(file);
			 if(!file.originalFilename)return cb(null, null);
			 var source = file.path;
			 var filename = randomString.generate() + file.name.substr( file.name.lastIndexOf('.'), file.name.length);
			 target = path.join( UPLOAD_PATH, label, filename);
			 fs.readFile(source, function (err, data) {
					console.log(err);
					if(err) return cb(err, null)
					fs.writeFile(target, data, function (err) {
						 console.log(err);
						 if(err) return cb(err, null)
						 if(thumb)
							 createThumb(filename, label, function(err, done){
								 console.log(err);
								 return cb(err, filename)
							 })
							return cb(null, filename);
						});
			 });
		},
	uploadFileBase64 : function(data, file_type, label, cb){
	   console.log("uploadFileBase64 called");
	   if(!data)  return cb(null, null);
	   var filename = randomString.generate()+".jpeg"
	    target = path.join(UPLOAD_PATH, label, filename);
	    fs.writeFile(target, new Buffer(data, "base64"), function (err) {
	      console.log('uploadErr:', err);
	      if(err) return cb(err, null)

         return cb(err, filename)
	  
	    });
	},
	crypto: function(text, type) {
		var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
		var key = 'password';

		if(type.toString() === 'encrypt') {
				var cipher = crypto.createCipher(algorithm, key);
				var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex');
				return encrypted;
		} else {
				var decipher = crypto.createDecipher(algorithm, key);
				var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8');
				return decrypted;
		}
	},

	sendMail: function(template, postData, cb) {
		console.log("sendMail called");
		// return cb(1,1);
		var template = new EmailTemplate(path.join( './templates/', template));
		// An example users object with formatted email function
		if(!template) return cb("template not found")
		// Send a single email
		template.render(postData, function(err, results) {
			if(err) return cb(err, null);
				transport.sendMail({
						from: process.env.FROM_MAIL,
						to: postData.email,
						subject: postData.subject,
						html: results.html,
						text: results.text
					}, function(err, responseStatus) {
						return cb(err, responseStatus);
				});
		});
	},

	// ***** test ffmpeg *****
	// mime = mime.lookup('fav.mp4');
	//   console.log(mime,mime.split('/')[0]);
	//   var proc = new ffmpeg('fav.mp4')
	//       .takeScreenshots({
	//         count: 1,
	//         timemarks: ['6'],
	//      }, '')
	//      .on('error', function(err) {
	//         console.log('an error happened: ' + err.message);
	//       })
	//      .on('filenames', function(filenames) {
	//       console.log(filenames);
	//    })

	createThumb: function(filename, label, cb){
		srcPath = path.join(UPLOAD_PATH, label, filename);
		dstPath = path.join(UPLOAD_PATH, label, 'thumb', filename);
		srcDir = path.join(UPLOAD_PATH, label);
		dstDir = path.join(UPLOAD_PATH, label, 'thumb');
		console.log(srcPath,'\n',dstPath);
		 var file_type = mime.lookup(path.join(uploadDir, label, filename));
		if(file_type.split('/')[0]=='image')
			 im.resize({
				 srcPath: srcPath,
				 dstPath: dstPath,
				 width:   256,
				 quality: 0.8
			 }, function(err, stdout, stderr){
				 console.log('thumbErr', err);
				 console.log('stdout:', stdout);
				 console.log('file uploadErr', stderr);
				 return cb(err, filename);
			 });
		 else if(file_type.split('/')[0]=='video')
				var proc = new ffmpeg(srcPath)
					 .takeScreenshots({
							count: 1,
							timemarks: ['6'],
					 }, dstDir)
					 .on('error', function(err) {
							console.log(err);
							return cb(err, null);
						})
					 .on('filenames', function(ts) {
							console.log('video thumb successfully',ts);
							ts = ts.toString();
							thumbName = filename.split('.')[0]+'.png';
							setTimeout(function(){
								 fs.renameSync(path.join(dstDir,'tn.png' ), path.join(dstDir, thumbName));
								 return cb(null, filename);
							}, 2000 )
					 })
		 else
				return cb("Not a valid File", filename);
	}
};
