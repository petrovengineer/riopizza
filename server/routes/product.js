const express = require('express');
const router = express.Router();
const {Product, Parameter, Item} = require('../models');
const {authenticateToken, isAdmin} = require('./auth');
var multer = require('multer');
var upload = multer({ dest: './public/', limits: {
    fileSize: 10 * 1024 * 1024,
  }});
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

router.get('/', authenticateToken, async (req, res)=>{
    let filter = {};
    if(req.query.filter!=null){
        filter = JSON.parse(req.query.filter)
    }
    try{
        let products = await Product.find(filter, {},  { sort: { 'created' : -1 }});
        let extProducts = [];
        for (let p = 0; p < products.length; p++){
            let {_id, name, description, img, parameters=[]} = products[p];
            const extParameters = [];
            for (let i=0; i<parameters.length; i++){
                let parameter = await Parameter.findById(parameters[i].parameter_id);
                let {name, value, available_items, unit, type} = parameter;
                const extAvailableItems = [];
                if (parameter.type !== 0) {
                    for (let k = 0; k < parameter.available_items.length; k++){
                        let availableItem = await Item.findById(parameter.available_items[k].item_id);
                        extAvailableItems.push(availableItem);
                    }
                }
                extParameters.push({name, value, extAvailableItems, unit, type});
            }
            extProducts.push({
                _id,
                name,
                description,
                img: img.data!=null?{data: Buffer(img.data, 'binary').toString('base64'), contentType: String}:null,
                extParameters
            })
        }
        res.send(extProducts);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name='New product', parameters=[], description=""} = req.body;
        const product = new Product({name, description, parameters});
        await product.save();
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

router.post('/upload', upload.single('file'), async (req, res)=>{
    try{
    const {_id} = req.query;
    await sharp(fs.readFileSync(req.file.path))
      .resize(300, 300, {
        fit: sharp.fit.cover,
        // withoutEnlargement: true
      })
      .toFile(path.resolve(__dirname, '../public/temp'));
    await Product.findByIdAndUpdate(_id, {
        img: {data: fs.readFileSync(path.resolve(__dirname, '../public/temp')), contentType : req.file.mimetype}
    });
    res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.put('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.body;
    const update = Object.assign({}, req.body);
    delete update._id;
    try{
        const food = await Product.findByIdAndUpdate(_id, update);
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
            await Product.findByIdAndDelete(id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;