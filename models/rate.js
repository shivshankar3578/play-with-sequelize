var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Rate = sequelize.define('rate',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			bank_id: DataTypes.INTEGER,
			card_id: DataTypes.INTEGER,
			user_id: DataTypes.INTEGER,
			type  : DataTypes.STRING,
			rate : DataTypes.INTEGER,
			review: DataTypes.STRING,
			status: {
				type: DataTypes.BOOLEAN,
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
			// logo: function () {
			// 		return baseurl +'uploads/outlets/'+ this.getDataValue('logo');
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
	Rate.associate = models => {
		 Rate.belongsTo(models.user, {})
		 Rate.belongsTo(models.bank, {})
	}


	return Rate

}
