var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Favourite = sequelize.define('favourite',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				  autoIncrement: true,
			},
			user_id: DataTypes.INTEGER,
			bank_id: DataTypes.INTEGER,
			card_id: DataTypes.INTEGER,
			status: {
				type: DataTypes.INTEGER,
				defaultValue: 1
			}
			
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
			//logo: function () {
				//	return baseurl +'uploads/outlets/'+ this.getDataValue('logo');
			//	}
			 },
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}
			
	});
	Favourite.associate = models => {
			 Favourite.belongsTo(models.user, {})
			 Favourite.belongsTo(models.bank, {})
			 Favourite.belongsTo(models.card, {})
	}


	return Favourite

}
