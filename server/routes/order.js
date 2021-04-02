const express = require('express');
const router = express.Router();
const {Order, User} = require('../models');
const {authenticateToken, isOperator} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.phone){
        filter = {phone: req.phone}
    }else{
        filter = {_id:0}
    }
    if(req.operator){filter = {}}
    console.log("FILTER",req.operator, req.phone, filter)
    try{
        Order.find(filter,{}, { sort: { 'created' : -1 }}).
        exec((err, docs)=>{
            res.send(docs);
        })
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, async (req, res)=>{
    try{
        const {cart, name, phone, address, apnumber, floor, comment, pay} = req.body;
        let user = {};
        if(phone!=null){
            user = await User.findOne({phone})
        }
        if(cart.length>0){
            const last = await Order.findOne({},{}, { sort: { 'created' : -1 } })
            const newOrder = new Order({
                cart,
                name, 
                phone,
                user_id: user?user._id:null,
                address,
                apnumber,
                floor,
                pay,
                comment,
                number: last==null?1:last.number+1
            });
            const saved = await newOrder.save();
            // const order = await Order.findOne({_id:saved._id});
            res.send(saved);
        }   
        else{res.sendStatus(500)}
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isOperator, async (req, res)=>{
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        await Food.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isOperator, async (req, res)=>{
    const {_id} = req.body;
    try{
        if(_id!=null){
            await Order.findByIdAndDelete(_id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;