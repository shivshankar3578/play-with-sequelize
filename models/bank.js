var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Bank =  sequelize.define('bank',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
			},
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 0
			},
			vote_count: DataTypes.INTEGER,
			total_votes: DataTypes.INTEGER,
			bankname: DataTypes.STRING,
			bankname_ar: DataTypes.STRING,
			banklogo: DataTypes.STRING,

			website: DataTypes.STRING,
			tollfree: DataTypes.STRING,
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER
			//status: DataTypes.BOOLEAN
		},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_user',
			hooks: {
				beforeValidate: (bank, options) => {
						// user.username = 'Toni';
				},
				// afterValidate: FX.hashPasswordHook,
				// beforeCreate: FX.hashPasswordHook,
				// beforeUpdate: FX.hashPasswordHook
			},
			getterMethods: {
				bank_id: function () {
					return this.getDataValue('id');
				},
				banklogo: function () {
					return baseurl +'uploads/banks/'+ this.getDataValue('banklogo');
				},

				vote_count: function () {
					return this.getDataValue('vote_count') ? this.getDataValue('vote_count') : 1 ;
				},

			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the user has several first names
					// }
			}

	});

	Bank.associate = models => {
		Bank.hasMany(models.rate,{} )
	}

	return Bank
}
