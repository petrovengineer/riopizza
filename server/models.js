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
	group: {_id: String, name: String},
	img: {data: Buffer, contentType: String},
    parameters: [{
        name: String, 
        _id: String, 
        value: String, 
        items: [{value: String, _id: String}],
        selected: {type: Boolean, default: false}
    }],
    show: {type: Boolean, default: true},
    place: {type: Number, default: 0},
    created: {type: Date, default: Date.now},
})

module.exports.Parameter = model('Parameter',{
	name: String,
    value: String,
    show: {type: Boolean, default: true},
	available_items: [{value: String, _id: String}],
	unit: String,
    type: {type: Number, default: 0}, //0-single, 1-checkable, 2-select
    created: {type: Date, default: Date.now},
})

module.exports.Item = model('Item',{
    value: String,
    group: {_id: String, name: String},
    sort: {type: Number, default: 999},
	affect: [
		{
			value: String, 
			parameter:{
				name: String, 
				_id: String
			}
        }],
    created: {type: Date, default: Date.now},
})

module.exports.ItemGroup = model('ItemGroup',{
	name: String,
    created: {type: Date, default: Date.now},
})

module.exports.ProductGroup = model('ProductGroup',{
	name: String,
    created: {type: Date, default: Date.now},
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