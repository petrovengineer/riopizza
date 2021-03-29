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
    if(req.query){
        filter = req.query
    }
    try{
        let products = await Product.find(filter, {},  { sort: { 'created' : -1 }});
        return res.send(products.map(p=>{
                let newP = Object.assign({}, p.toObject());
                newP.img = p.img.data!=null?{data: Buffer(p.img.data, 'binary').toString('base64')}:null;
                // console.log(newP)
                return newP;
            }))
        // let extProducts = [];
        // for (let p = 0; p < products.length; p++){
        //     let {_id, name, description, img, parameters=[]} = products[p];
        //     const extParameters = [];
        //     for (let i=0; i<parameters.length; i++){
        //         let parameter = await Parameter.findById(parameters[i]._id);
        //         if(parameter){
        //             let {_id, name, unit, type, show} = parameter;
        //             let {items = []} = parameters[i];
        //             const extItems = [];
        //             if (type !== 0 && items && items.length!==0) {
        //                 for (let k = 0; k < items.length; k++){
        //                     let item = await Item.findById(items[k]._id);
        //                     extItems.push(item);
        //                 }
        //             }
        //             extParameters.push({_id, name, value: parameters[i].value, selected: parameters[i].selected, items: extItems, unit, type, show});
        //         }else{
        //             extParameters.push({name: parameters[i].name, 
        //                 // parameter_id: parameters[i].parameter_id, 
        //                 deleted: true});
        //         }
        //     }
        //     extProducts.push({
        //         _id,
        //         name,
        //         description,
        //         img: img.data!=null?{data: Buffer(img.data, 'binary').toString('base64'), contentType: String}:null,
        //         parameters: extParameters
        //     })
        // }
        // if(extProducts.length===1){
        //     res.send(extProducts[0]);
        // }else{res.send(extProducts);}
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.post('/', authenticateToken, isAdmin, async (req, res)=>{
    try{
        const {name='New product', description=""} = req.body;
        const count = await Product.countDocuments({});
        const product = new Product({name, description, place:count});
        await product.save();
        let {parameters=[]} = product;
        const extParameters = [];
        for (let i=0; i<parameters.length; i++){
            let parameter = await Parameter.findById(parameters[i].parameter_id);
            if(parameter){
                let {name, available_items, unit, type} = parameter;
                const extAvailableItems = [];
                if (parameter.type !== 0) {
                    for (let k = 0; k < available_items.length; k++){
                        let availableItem = await Item.findById(available_items[k].item_id);
                        extAvailableItems.push(availableItem);
                    }
                }
                extParameters.push({name, value: parameters[i].value, extAvailableItems, unit, type, selected: parameters[i].selected});
            }else{
                extParameters.push({name: parameters[i].name, parameter_id: parameters[i].parameter_id, deleted: true});
            }
        }
        const {_doc: newExtProduct} = Object.assign({}, product)
        newExtProduct.extParameters = extParameters;
        res.send(newExtProduct);
    }
    catch(err){
        console.log(err);
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
        const product = await Product.findOne({_id});
        Object.keys(update).map(key=>{
            product[key] = update[key];
        })
        await product.save();
        const img = product.img.data!=null?{data: Buffer(product.img.data, 'binary').toString('base64'), contentType: String}:null;
        let {name, description, parameters} = product;
        res.send({
            _id: product._id,
            name,
            description,
            img,
            parameters
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.delete('/', authenticateToken, isAdmin, async (req, res)=>{
    const {_id} = req.query;
    try{
        if(_id!=null){
            await Product.findByIdAndDelete(_id);
            res.sendStatus(200);
        }
        else{res.sendStatus(500)}
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;