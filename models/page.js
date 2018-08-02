var models = require('../models');
module.exports = function (sequelize, DataTypes) {
	const Page = sequelize.define('page',
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
			slug: DataTypes.STRING,
			title: DataTypes.STRING,
			title_ar: DataTypes.STRING,
			body: DataTypes.TEXT,
			body_ar: DataTypes.TEXT,
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER,
		},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_page',
			getterMethods: {
				page_id: function () {
					return this.getDataValue('id');
				},
				// url: function () {
				// 	return baseurl + 'static/' + this.getDataValue('slug');
				// }
			},
			setterMethods: {
					// description: function (value) {
					//     var parts = value.split(' ')
					//     this.setDataValue('lastName', parts[parts.length-1])
					//     this.setDataValue('firstName' parts[0]) // this of course does not work if the page has several first names
					// }
			}
		});

		Page.associate = models => {
				// Page.belongsTo(models.Bank, {})
		}

	return Page
}
