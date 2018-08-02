var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Branch = sequelize.define('branch',
		{
			id: {
					type:DataTypes.INTEGER,
					primaryKey: true,
				 autoIncrement: true,
			},
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 0
			},
			bank_id: DataTypes.INTEGER,
			name: DataTypes.STRING,
			name_ar: DataTypes.STRING,
			address  : DataTypes.STRING,
			place_id  : DataTypes.STRING,
			logo  : DataTypes.STRING,
			servicetype  : DataTypes.STRING,
			telephone: DataTypes.STRING,
			email: DataTypes.STRING,
			contact: DataTypes.TEXT,
			contact_ar: DataTypes.TEXT,
			latitude: DataTypes.STRING,
			longitude: DataTypes.STRING,
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
				servicetype: function () {
					//return this.getDataValue('servicetype').split(",")
                     var str = this.getDataValue('servicetype')
                    return str? str.split(",") : []
					
				},
				logo: function () {
					return  baseurl +'uploads/branches/'+  this.getDataValue('logo');
				},
				branch_id: function () {
					return this.getDataValue('id');
				}
		 },
			setterMethods: {
				servicetype: function (val) {
					//return this.setDataValue("servicetype",val.join(","))
                    return this.setDataValue("servicetype",val ? val.join(",") : "" )
				},	
			}
			
	});
	Branch.associate = models => {
			Branch.belongsTo(models.bank,{} )
	}


	return Branch

}
