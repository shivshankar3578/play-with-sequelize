var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Coin = sequelize.define('coin',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			number : DataTypes.INTEGER,
			name  : DataTypes.STRING,
			name_ar  : DataTypes.STRING,
			status: {
				type: DataTypes.BOOLEAN,
				defaultValue: 0
			},
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER
			
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

			 },
			setterMethods: {

			}
			
	});
	Coin.associate = models => {
			// Pref.belongsTo(models.bank, {})
	}


	return Coin

}
