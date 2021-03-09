const express = require('express');
const router = express.Router();
const {Parameter} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        const parameters = await Parameter.find(filter);
        res.send(parameters);
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
        await Parameter.findByIdAndUpdate(_id, update);
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
            name = 'New parameter',
            value = null,
            items = [],
            available_items = [],
            unit = null,
            type = 0 
        } = req.body;
        await Parameter.create({name, value, items, available_items, unit, type});
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {id} = req.query;
    try{
        if(id!=null){
            await Parameter.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;