var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Applycard = sequelize.define('applycard',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			bank_id: DataTypes.INTEGER,
			card_id: DataTypes.INTEGER,
			user_id: DataTypes.INTEGER,
			designation: DataTypes.STRING,
			office_name: DataTypes.STRING,
			office_address: DataTypes.STRING,
			mobile: DataTypes.INTEGER,
			office_pan_no: DataTypes.STRING,
			subscription: DataTypes.STRING,
			first_name: DataTypes.STRING,
			last_name: DataTypes.STRING,
			gender: DataTypes.STRING,
			email: DataTypes.STRING,
			last_qualification: DataTypes.STRING,
			house_number: DataTypes.STRING,
			city_name: DataTypes.STRING,
			pin_code: DataTypes.INTEGER,
			state: DataTypes.STRING,
			pan_no: DataTypes.INTEGER,
			hold_date: DataTypes.DATE,
			process_date: DataTypes.DATE,
			cancel_date: DataTypes.DATE,
			complete_date: DataTypes.DATE,
			status:{
				type:DataTypes.INTEGER,
				defaultValue: 0
			},
			

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
			// created_at: function () {
			// 	return this.getDataValue('created_at').toLocaleDateString();
			// }
			 },
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}
			
	});
	Applycard.associate = models => {
		Applycard.belongsTo(models.bank, {})
		Applycard.belongsTo(models.card,{} )
		Applycard.belongsTo(models.user,{} )


	}


	return Applycard

}
