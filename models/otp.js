var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Otp = sequelize.define('otp',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},

			email:{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			otp: DataTypes.INTEGER,
		},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_otp',
			hooks: {
				beforeValidate: (otp, options) => {
						// otp.otpname = 'Toni';
				},
			// afterValidate: FX.hashPasswordHook,
				beforeCreate: FX.hashPasswordHook,
				// beforeUpdate: FX.hashPasswordHook,
				// beforeBulkUpdate: FX.hashPasswordHook
			},
			getterMethods: {

			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the otp has several first names
					// }
			}
	});

	Otp.associate = models => {
	}

	Otp.prototype.toJSON = function () {
		var values = Object.assign({}, this.get());
		// delete values.password;
		return values;
	};

	return Otp

}
