var models = require('../models');

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('user',
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
			userType:{
					type:DataTypes.INTEGER,
					defaultValue: 0
			},
			status:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
			// username:{
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// 	unique: true
			// },

			bank_id: DataTypes.INTEGER,
			name: DataTypes.STRING,
			address : DataTypes.STRING,
			gender :  DataTypes.STRING,
			superadmin: DataTypes.BOOLEAN,
			password: DataTypes.STRING,
			//userType: DataTypes.INTEGER,
			date_of_birth: DataTypes.DATEONLY,
			role: DataTypes.STRING,
			profile_image:{
				type:	DataTypes.STRING,
				defaultValue:'user.png'
			},
			device_type: DataTypes.STRING,
			device_token: DataTypes.STRING,
			marital_status: DataTypes.STRING,
			last_qualification: DataTypes.STRING,
			residence: DataTypes.STRING,
			employment: DataTypes.STRING,
			salary_account: DataTypes.STRING,
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER, 
			work_exp: DataTypes.STRING,
			pan_no: DataTypes.STRING,
			national_id: DataTypes.STRING,
			is_arabic: DataTypes.INTEGER,
			is_notify:{
				type:DataTypes.BOOLEAN,
				defaultValue: 1
			},
			coin: DataTypes.STRING,
		},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_user',
			hooks: {
				beforeValidate: (user, options) => {
						// user.username = 'Toni';
				},
			// afterValidate: FX.hashPasswordHook,
				beforeCreate: FX.hashPasswordHook,
				// beforeUpdate: FX.hashPasswordHook,
				// beforeBulkUpdate: FX.hashPasswordHook
			},
			getterMethods: {
				user_id: function () {
					return this.getDataValue('id');
				},
				profile_image: function () {
					return baseurl +'uploads/users/'+ this.getDataValue('profile_image');
				},
				created_at: function () {
					var d= this.getDataValue('created_at')
					return d ? d.toLocaleDateString() : " " ;
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

	User.associate = models => {
			User.belongsTo(models.bank, {})
	}

	User.prototype.toJSON = function () {
		var values = Object.assign({}, this.get());
		// delete values.password;
		return values;
	};

	return User

}
