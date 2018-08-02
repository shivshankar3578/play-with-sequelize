var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const Reward = sequelize.define('reward',
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
			program_name: DataTypes.STRING,
			program_name_ar: DataTypes.STRING,
			description: DataTypes.STRING,
			description_ar: DataTypes.STRING,
			reward_rate  : DataTypes.INTEGER,
			redeem_rate :  DataTypes.INTEGER,
		//	status: DataTypes.BOOLEAN,
			redeem_mechanism : DataTypes.STRING,
			redeem_mechanism_ar : DataTypes.STRING,
			earning_time : DataTypes.STRING,
			outlets_list : DataTypes.STRING,
			points_enquires : DataTypes.STRING,
			points_validity : DataTypes.STRING,
			earns_points    : DataTypes.STRING,
			earns_points_ar    : DataTypes.STRING,
			special_offers	: DataTypes.STRING,
			special_offers_ar	: DataTypes.STRING,
			number_of_outlets : DataTypes.STRING,
			// updated_by: DataTypes.INTEGER,
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
			// getterMethods: {
			// 	user_id: function () {
			// 		return this.getDataValue('id');
			// 	},
			// 	profile_image: function () {
			// 		return baseurl +'uploads/users/'+ this.getDataValue('profile_image');
			// 	}
			// },
			getterMethods: {
				outlets_list: function () {
					var str = this.getDataValue('outlets_list')
					return str? str.split(",") : []
					
				}
		   },
			setterMethods: {
				outlets_list: function (val) {
					return this.setDataValue("outlets_list",val ? val.join(",") : "" )
				},	
			}
		
	});
	Reward.associate = models => {
			// User.belongsTo(models.bank, {})
	}


	return Reward

}
