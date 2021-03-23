const express = require('express');
const router = express.Router();
const {ProductGroup} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        const productGroups = await ProductGroup.find(filter,{}, { sort: { 'created' : -1 }});
        res.send(productGroups);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        await ProductGroup.findByIdAndUpdate(_id, update);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {
            name = "New group",
        } = req.body;
        let newProductGroup = await ProductGroup.create({name});
        res.send(newProductGroup);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.query;
    try{
        if(_id){
            await ProductGroup.findByIdAndDelete(_id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;