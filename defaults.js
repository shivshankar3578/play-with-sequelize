// messages
module.exports = {
		preferences: [
			{ id: 'cardCategory', val: 'Card Category'},
			{ id: 'network', val:'Networks' },
			{ id: 'targetedUsers',val: 'Targeted Users'} ,
			{ id: 'serviceType',val: 'Service Type'} 
		],
		targetedUsers: [
			
		],

		cardCategory: [
		
		],
		network: [
		
		],
		addonCard: [
			{id:"onrequest", name: "Available on request"},
			{id:"free", name: "Free"},
			{id:"no", name: "No"},
			{id:"yes", name: "Yes"},
			{id:"max4", name: "Max up to 4"}
		],

		ctrls: [
		{	
			name: "providers",
			display: "Product Officer",
			icon: "view_list",
			methods: [{
					name: "View Product Officer",
					path: "providers/"
			},
			{
				name: "Add Product Officer",
				path: "providers/add"
			}]
		},

		{
			name: "admins",
			display: "Admin Manager",
			icon: "view_list",
			methods: [{
					name: "View Admins",
					path: "admins/"
			},
			{
					name: "Add Admin",
					path: "admins/add"
			}]
		},

	
		{
			name: "users",
			display: "Customers",
			icon: "view_list",
			methods: [{
					name: "View Users",
					path: "users/"
			}]
		},

		{	
			name: "providers",
			display: "Product Managers",
			icon: "view_list",
			methods: [{
					name: "View Product Managers",
					path: "providers/"
			},
			{
				name: "Add Product Manager",
				path: "providers/add"
			}]
		},

		{
			name: "cards",
			display: "Cards",
			icon: "view_list",
			methods: [
			{
				name: "Add Card",
				path: "cards/add"
			},
			{
					name: "View Cards",
					path: "cards/"
			}]
		},
		{
			name: "banks",
			display: "Issuers",
			icon: "view_list",
			methods: [{
					name: "View Issuers",
					path: "banks/"
			}]
		},
        {
			name: "rates",
			display: "Reviews & Ratings",
			icon: "view_list",
			methods: [{
				name: "Review & Rating List",
				path: "rates/"
			}]
		},
		{
			name: "leads",
			display: "Leads",
			icon: "view_list",
			methods: [{
					name: "View Applied Cards",
					path: "leads/"
			},
			{
					name: "View Card Enquiries",
					path: "leads/enquiry/"
			}]
		},
		{
			name: "branches",
			display: "Branch",
			icon: "view_list",
			methods: [{
					name: "View Branch",
					path: "branches/"
			},
			{
				name: "Add Branch",
				path: "branches/add"
			}]
		},
		{
			name: "outlets",
			display: "Outlets ",
			icon: "view_list",
			methods: [{
					name: "View Outlet",
					path: "outlets/"
			},
			{
				name: "Add Outlet",
				path: "outlets/add"
			},
			]
		},
		{
			name: "rewards",
			display: "Rewards ",
			icon: "view_list",
			methods: [{
					name: "View Reward",
					path: "rewards/"
			},
			{
				name: "Add Reward",
				path: "rewards/add"
			}]
		},
		{
			name: "prefs",
			display: "Preferences ",
			icon: "view_list",
			methods: [{
					name: "View Preferences",
					path: "prefs/"
			},
			{
				name: "Add Preferences",
				path: "prefs/add"
			}]
		},
		{
			name: "coins",
			display: "Coins ",
			icon: "view_list",
			methods: [{
					name: "View Coins",
					path: "coins/"
			},
			{
				name: "Add Coins",
				path: "coins/add"
			}]
		},
		{
			name: "pages",
			display: "Static Pages ",
			icon: "view_list",
			methods: [{
					name: "View Static Pages",
					path: "pages/"
			},
			{
				name: "Add Static Page",
				path: "pages/add"
			}]
		}
			
	]
}
