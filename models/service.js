var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Service = sequelize.define('service',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true
			},

			address: DataTypes.STRING,
			name: DataTypes.STRING,
			telephone: DataTypes.STRING,
			email: DataTypes.STRING,
			contactperson: DataTypes.STRING,
			bank_id: DataTypes.INTEGER,
			servicetype: DataTypes.STRING,
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
			hooks: {
				beforeValidate: (service, options) => {
						// user.username = 'Toni';
				},
				afterValidate: FX.hashPasswordHook,
				beforeCreate: FX.hashPasswordHook,
				beforeUpdate: FX.hashPasswordHook
			},
			getterMethods: {
				service_id: function () {
					return this.getDataValue('id');
				},
				cardback: function () {
					return baseurl +'uploads/services/'+ this.getDataValue('cardback');
				},
				banklogo: function () {
					return baseurl +'uploads/services/'+ this.getDataValue('banklogo');
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

	Service.associate = models => {
			Service.belongsTo(models.bank,{} )
	}

	return Service
}
