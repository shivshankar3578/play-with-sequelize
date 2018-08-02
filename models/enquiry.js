var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Enquiry = sequelize.define('enquiry',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			bank_id: DataTypes.INTEGER,
			card_id: DataTypes.INTEGER,
			company_name  : DataTypes.STRING,
			employment_type :  DataTypes.STRING,
			//status: DataTypes.BOOLEAN,
			month_salary : DataTypes.INTEGER,
			salary_bank_id : DataTypes.INTEGER,
			existing_card_bank_id: DataTypes.STRING,
			age: DataTypes.INTEGER,
			date_of_birth: DataTypes.DATEONLY,
			name: DataTypes.STRING,
			mobile: DataTypes.INTEGER,
			email: DataTypes.STRING,
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: 0
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
			 	enquiry_id: function () {
					return this.getDataValue('id');
			 	},
			logo: function () {
					return baseurl +'uploads/outlets/'+ this.getDataValue('logo');
				}
			 },
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}
			
	});
	Enquiry.associate = models => {
			Enquiry.belongsTo(models.bank, {})
			Enquiry.belongsTo(models.card, {})
	}


	return Enquiry

}
