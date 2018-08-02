var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Pref = sequelize.define('pref',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			preference  : DataTypes.STRING,
			key  : DataTypes.STRING,
			val  : DataTypes.STRING,
			val_ar  : DataTypes.STRING,
			icon  : DataTypes.STRING,
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
				icon: function () {
					return  baseurl +'uploads/prefs/'+  this.getDataValue('icon');
				}
			 },
			setterMethods: {

			}
			
	});
	Pref.associate = models => {
			// Pref.belongsTo(models.bank, {})
	}


	return Pref

}
