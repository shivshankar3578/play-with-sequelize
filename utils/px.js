const EmailTemplate = require('email-templates').EmailTemplate;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const apn = require('apn');
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

	sendPush: function(user, msg, payload) {
		console.log("apn called", user, user.device_token);
		payload.sound=  'default'
		// payload.sound = "default";
		if(user.device_type=='ios'){
			var note = new apn.notification();
			var tokens = [user.device_token];
			note.setAlertText(msg);
			note.badge = user.badge? user.badge: 0;
			note.sound = "ctu_ringtone.caf";
			note.payload = payload
			cservice.pushNotification(note, tokens);
		}

		else if(user.device_type=='android'){
		var bodyData = {
					priority: 'high', 
					contentAvailable: true, 
					delayWhileIdle: true, 
					timeToLive: 10,
					registration_ids: [user.device_token ],
					data: Object.assign({
						vibrate: 1,
						sound: 'ctu_ringtone.mp3',
						message: msg,
						title: msg,
						largeIcon: 'large_icon',
						smallIcon: 'small_icon',
					}, payload)
				}

		require('request')({
				url: 'https://android.googleapis.com/gcm/send',
				method: 'POST',
				headers: {
					'Content-Type' :' application/json',
					'Authorization': 'key=AAAAz-UPh4o:APA91bFk1X-svyL1j02jUoVvh1evLtIdlzo2HWOoRNvGs59PKuewedxdty_fyXsu52n9UqAqUZjsXt-8EqLllJRZZP0m26NHF7BeWzJIqbCSLfBSyR5ObgOltpxZAJihMCzxjJo28vYt'
				},
				body: JSON.stringify(bodyData)
			}, function(error, response, body) {
				console.log(error,body)
		})
		}
	},

	uploadFile: function(file, label, thumb){
		console.log("uploadFile called", file);

		return new Promise((resolve, reject)=>{

			if(!file || !label)  return resolve(null)
			// console.log(file);
			var source = file.path;
			var filename = randomString.generate() + file.name.substr( file.name.lastIndexOf('.'), file.name.length);
			target = path.join( UPLOAD_PATH, label, filename);

			fs.readFile(source, function (err, data) {
				if(err) return reject(err)
				fs.writeFile(target, data, function (err) {
					 if(err) return reject(err)
					 return resolve(filename);
					});
			});
		});
	},

	uploadFileBase64 : function(data, label, thumb){
	   console.log("uploadFileBase64 called");
   	return new Promise((resolve, reject)=>{
		   if(!data)  return resolve(null);
		   var filename = randomString.generate()+".jpeg"
		    target = path.join(UPLOAD_PATH, label, filename);
		    fs.writeFile(target, new Buffer(data, "base64"), function (err) {
		     	 if(err) return reject(err)
					 return resolve(filename);
		    });
		 });
	},
	sendMail: function(template, postData) {
		console.log("sendMail called");
		var template = new EmailTemplate(path.join( './templates/', template));

		return new Promise((resolve, reject)=>{
		// return resolve(true);
		// An example users object with formatted email function
		if(!template)
			return reject(new Error("template not found"))
		// Send a single email
			template.render(postData, (err, results)=> {
				if(err)  return reject(err)
					transport.sendMail({
							from: process.env.FROM_MAIL,
							to: postData.email,
							subject: postData.subject,
							html: results.html,
							text: results.text
						}, (err, responseStatus)=> {
							if(err) return reject(err)
							return resolve(responseStatus);
					});
			});
		})
	}
}
