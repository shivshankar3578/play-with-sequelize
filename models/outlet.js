var models = require('../models');
var url  = require('url')
module.exports = function (sequelize, DataTypes) {
	const Outlet = sequelize.define('outlet',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			name: DataTypes.STRING,
			name_ar: DataTypes.STRING,
			address: DataTypes.STRING,
			google_map_location  : DataTypes.STRING,
			// redeem_rate :  DataTypes.STRING,
			// offers_for_card  : DataTypes.STRING,
			// offers_for_card_ar  : DataTypes.STRING,
			logo  : DataTypes.TEXT,
			latitude: DataTypes.STRING,
			longitude: DataTypes.STRING,
			place_id: DataTypes.STRING,
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: 0
			},
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER,
			
			},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_user',
			// hooks: {
			// 	beforeValidate: (user, options) => {
			// 			// user.username = 'Toni';
			// 	},
			// 	afterValidate: FX.hashPasswordHook,
			// 	beforeCreate: FX.hashPasswordHook,
			// 	beforeUpdate: FX.hashPasswordHook
			// },
			getterMethods: {
			// 	user_id: function () {
			// 		return this.getDataValue('id');
			// 	},
			logo: function () {
				return  baseurl +'uploads/outlets/'+  this.getDataValue('logo');
			}
			// logo: function () {
			// 	var logo =  this.getDataValue('logo');
			// 		try {
			// 			// console.log("###", logo);
			// 			var host = url.parse(logo).hostname.toString()
			// 			return logo
			// 		} catch (e) {
			// 			console.log("no a valid picture url");
			// 				return  baseurl +'uploads/outlets/'+ logo
			// 		}
				
			// 	}
			 },
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}
			
	});
	Outlet.associate = models => {
			// User.belongsTo(models.bank, {})
	}


	return Outlet

}
