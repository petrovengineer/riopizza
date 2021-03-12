const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../models');
const mongoose = require('mongoose');

router.post('/login', async (req, res)=>{
    try{
        if(req.body.phone==null || req.body.password==null){res.sendStatus(500)}
        const phone = req.body.phone;
        const user = await User.findOne({phone});
        if(user==null){
            return res.sendStatus(400);
        }
        if(await bcrypt.compare(req.body.password, user.password)){
            const accessToken = generateAccessToken({phone, admin: user.admin});
            const refreshToken = jwt.sign(phone, process.env.REFRESH_TOKEN_SECRET);
            user.refreshToken = refreshToken;
            await user.save();
            res.send({accessToken, refreshToken, user:{name:user.name, phone:user.phone, admin: user.admin}});
        }else{
            res.sendStatus(401);
        }
    }
    catch(e){
        console.log(e)
        res.sendStatus(500);
    } 
})

router.post('/refresh', (req, res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({phone: user.phone});
        res.send({accessToken});
    })
})

router.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter((token)=>token!=req.body.token);
    res.sendStatus(204);
})

router.post('/reg', async (req, res)=>{
    try{
        const {password, name = 'Новый пользователь', phone = null} = req.body;
        const exist = await User.findOne({phone});
        if(phone != null && password != null && exist == null){
            const hashedPassword = await bcrypt.hash(password, 10);
            let code = Math.random().toString(36).substring(7);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                password: hashedPassword,
                phone,
                name
            });
            await user.save();
            res.sendStatus(200);
        }
        else res.sendStatus(500);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

router.get('/makeadmin', authenticateToken, async (req, res)=>{
    try{
        const {_id} = req.query;
        if(req.phone === '+79500424342'){
            const user = await User.findById({_id}, {password:0});
            if(user!=null){
                user.admin = true;
                await user.save();
                res.sendStatus(200);
            }else {
                res.sendStatus(500);
            }
        }
        else {
            res.sendStatus(500);
        }
    }
    catch(err){
        res.sendStatus(500);
    }
})

function generateAccessToken({phone, admin}){
    return jwt.sign({phone, admin}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '365d'});
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("TOKEN ", authHeader);
    if (token == null){
        next();
    }else{
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(user!=null){
            req.phone = user.phone; 
            req.admin = user.admin;
        }
        next();
    })}
}

module.exports.isAdmin = (req, res, next)=>{
    if(req.admin === true){
        next();
    }
    else{
        res.sendStatus(402);
    }
}

module.exports.isSuper = (req, res, next)=>{
    if(req.phone =='+79500424342'){
        next();
    }
    else{
        res.sendStatus(402);
    }
}

module.exports.authenticateToken = authenticateToken;
module.exports.router = router;