var models = require('../models');
module.exports = function (sequelize, DataTypes) {
	const Card =  sequelize.define('card',
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
			bank_id: DataTypes.INTEGER,
		//	status: DataTypes.BOOLEAN,
			cardname: DataTypes.STRING,
			cardname_ar: DataTypes.STRING,
			description: DataTypes.STRING,
			servicetype: DataTypes.INTEGER,
			apr: DataTypes.STRING,
			annualfee: DataTypes.STRING,
			_annualfee: DataTypes.STRING,
			brand: DataTypes.STRING,
			targeted_users: DataTypes.STRING,
			credit_needed: DataTypes.STRING,
			late_payment: DataTypes.STRING,
			forgin_tran: DataTypes.STRING,
			balance_trans: DataTypes.STRING,
			reward_list: DataTypes.STRING,
			returned_pay: DataTypes.STRING,
			penalty: DataTypes.STRING,
			min_intrest: DataTypes.STRING,
			cash_adv: DataTypes.STRING,
			yearly_fee: DataTypes.STRING,
			yearly_add: DataTypes.STRING,
			reissuance: DataTypes.STRING,
			add_card: DataTypes.STRING,
			minimum_monthly: DataTypes.STRING,
			monthly_intrest: DataTypes.STRING,
			monthly_subscription: DataTypes.STRING,
			grace_period: DataTypes.STRING,
			regular_purchase: DataTypes.STRING,
			intro_purchase: DataTypes.STRING,
			intro_bt: DataTypes.STRING,
			maximum_cash: DataTypes.STRING,
			maximum_credit: DataTypes.STRING,
			signup_bonus: DataTypes.STRING,
			reward_rate: DataTypes.STRING,
			payment_death: DataTypes.BOOLEAN,
			reward_program: DataTypes.STRING,
			remittance_services: DataTypes.BOOLEAN,
			telephonic_ass: DataTypes.BOOLEAN,
			protection_services: DataTypes.STRING,
			travel_insurance: DataTypes.STRING,
			airport_lounge: DataTypes.STRING,
			emergency_cash: DataTypes.STRING,
			extended_waranty: DataTypes.STRING,
			card_category:DataTypes.STRING,
			network: DataTypes.STRING,
			is_created: DataTypes.BOOLEAN,
			created_by: DataTypes.INTEGER,
			updated_by: DataTypes.INTEGER,
			is_published: DataTypes.BOOLEAN,
			published_by: DataTypes.INTEGER,
			published_on: DataTypes.DATE,
			cardback: DataTypes.STRING,
			frontimage: DataTypes.STRING,
	
		},
		{
			timestamps: true,
			paranoid: false,
			underscored: true,
			// freezeTableName: true,
			// tableName : 't_card',

			getterMethods: {
				card_id: function () {
					return this.getDataValue('id');
				},
				cardback: function () {
					return baseurl +'uploads/cards/'+ this.getDataValue('cardback');
				},
				frontimage: function () {
					return baseurl +'uploads/cards/'+ this.getDataValue('frontimage');
				},
				reward_list: function () {
					//return this.getDataValue('reward_list').split(",")
					var str = this.getDataValue('reward_list')
					return str? str.split(",") : []
				}
				// annualfee: function () {
				// 	var fee = this.getDataValue('annualfee');
					
				// }
			},
			setterMethods: {
				reward_list: function (val) {
					//return this.setDataValue("outlets_list",val.join(","))
					return this.setDataValue("reward_list",val ? val.join(",") : "" )
				},	
			}
		});

	Card.associate = models => {
			Card.belongsTo(models.user,{foreignKey:"published_by"} )
			Card.belongsTo(models.user,{foreignKey:"updated_by", as : "updatedBy"} )
			Card.belongsTo(models.bank,{} )
			Card.hasMany(models.rate,{} )
			Card.hasMany(models.favourite,{} )
	}

	return Card
}
