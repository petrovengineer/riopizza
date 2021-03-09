const mongoose = require('mongoose');
const {Schema, model} = mongoose;

module.exports.User = model('User', { 
    phone: {type: String, required: true},
    password: String,
    name: String,
    refreshToken: String,
    active: {type: Boolean, default: false},
    created:  {type: Date, default: Date.now},
    cart:[{type: Schema.Types.ObjectId, ref:'Food'}],
    address: String,
    appart_number: String,
    floor: String,
    admin: {type: Boolean, default: false},
});

module.exports.Product = model('Product',{
	name: String,
	description: String,
	img: {data: Buffer, contentType: String},
	parameters: [{name: String, parameter_id: String}]
})

module.exports.Parameter = model('Parameter',{
	name: String,
	value: String,
	items: [{value: String, parameter_item_id: String}],
	available_items: [{value: String, item_id: String}],
	unit: String,
	type: Number //0-single, 1-checkable, 2-select
})

module.exports.Item = model('Item',{
	value: String,
	affect: [
		{
			value: String, 
			parameter:{
				parameter_name: String, 
				parameter_id: String
			}
		}]
})

module.exports.Order = model('Order',
    {
        number:{type: Number, default: 1},
        created: {type: Date, default: Date.now},
        done: {type: Date, default: null},
        status: {type: Number, min: 0, max:3, default: 0},
        cart:[
            {
                product: {name: String, product_id: String}, 
                count: Number,
                coast: Number,
                parameters: [{name: String, }]
            }
        ],
        user:{name: String, phone: String, user_id: String},
        address:{type: String},
        appart_number:{type: String},
        floor:{type: String},
        pay:{type: String},
        comment:String
    }
)