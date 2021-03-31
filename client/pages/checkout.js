import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AppContext from '../context';
import { useContext } from 'react';
import Layout from '../components/layout';
import axios from 'axios';
import {useRouter} from 'next/router'

const Order = ()=>{
    const router = useRouter();
    const context = useContext(AppContext);
    const {cart: cartFull} = context;
    const {cart:{value:cart=[]}, user} = context;
    const [err, setErr] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [apnumber, setApnumber] = useState('');
    const [floor, setFloor] = useState('');
    const [pay, setPay] = useState('cash');
    const [comment, setComment] = useState('');
    const [load, setLoad] = useState(false);
    const [complite, setComplite] = useState(false);
    const [order, setOrder] = useState(null);
    const [city, setCity] = useState('');
    const [help, showHelp] = useState(false);

    let amount = 0; 
    cart && cart.map(({affects, parameters, count})=>{
        const coast = affects.filter(a=>(a.parameter.name==='Цена')).map(a=>(a.value)).reduce((acc, cur)=>(+acc + +cur),0) + +parameters['Цена'].value;
        amount = amount + (coast * count);
    })

    const handleCity = (e)=>{
        const value = e.currentTarget.value;
        if(value.length>0 && !help){
            showHelp(true);
        }else if(value.length==0 && help){
            showHelp(false);
        }
        setCity(value)
    }
    const handleName = (e)=>{
        setName(e.currentTarget.value);
    }
    const handlePhone = (e)=>{
        setPhone(e.currentTarget.value);
    }
    const handleAddress = (e)=>{
        setAddress(e.currentTarget.value);
    }
    const handleApnumber = (e)=>{
        setApnumber(e.currentTarget.value);
    }
    const handleFloor = (e)=>{
        setFloor(e.currentTarget.value);
    }
    const handlePay = (e)=>{
        setPay(e.currentTarget.value);
    }
    const handleComment = (e)=>{
        setComment(e.currentTarget.value);
    }
    useEffect(()=>{
        if(user!=null && user.value!=null){
            setName(user.value.name);
            setPhone(user.value.phone);
            // if(user.value.address!=null)setAddress(user.value.address);
            // if(user.value.apnumber!=null)setApnumber(user.value.apnumber);
            // if(user.value.floor!=null)setFloor(user.value.floor);
        }
    }, [user])

    const makeOrder = async ()=>{
        try{
            let re = /^\+(7\d{10})$/;
            var valid = re.test(phone);
            if(!valid){
                setErr('Неверный формат телефона! ');
                return;
            }
            if(name==''){
                setErr('Имя не должно быть пустым!');
                return;
            }
            if(city==''){
                setErr('Город/Населённый пункт не должен быть пустым!');
                return;
            }
            if(cities.map(c=>c.name).indexOf(city)===-1){
                setErr('К сожалению мы не доставляем еду в этот населённый пункт!');
                return;
            }
            const fullCity = cities[cities.map(c=>c.name).indexOf(city)];
            const min = fullCity.min;
            if(amount<min)
            {
                setErr(`Минимальная сумма заказа для вашего населённого пункта ${fullCity.min} руб...`);
                return;
            }
            if(address==''){
                setErr('Адрес не должен быть пустым!');
                return;
            }
            if(cart.length==0){
                setErr('Корзина не должна быть пустой!');
                return;
            }
            setErr(false);
            setLoad(true);
            const newCart = cart.map(
                ({affects, parameters, count, product})=>(
                    {
                        product: {_id: product._id, name: product.name},
                        count,
                        coast: affects.filter(a=>(a.parameter.name==='Цена')).map(a=>(a.value)).reduce((acc, cur)=>(+acc + +cur),0) + +parameters['Цена'].value,
                        parameters: Object.keys(parameters).map(key=>{
                            if(Array.isArray(parameters[key])){
                                return {
                               
                                    // name: key,
                                    // selected: parameters[key][0].selected,
                                    // items: parameters[key].map(item=>({
                                    //     _id: item.value,
                                    //     name: item.label,
                                    // })),
                                    // ptype: parameters[key][0].type || 0,
                                }
                            }
                            else{
                                return (
                                    {
                                        name: key,
                                        type: parameters[key].type,
                                        value: parameters[key].value
                                    }
                                    // {
                                    //     name: key,
                                    //     ptype: parameters[key].type || 0,
                                    //     items: [{
                                    //         _id: parameters[key].value,
                                    //         name: parameters[key].label
                                    //     }]
                                    // }
                                )
                            }
                        })
                    }
                )
            )
            const payload = {
                cart: newCart, 
                name, 
                phone, 
                address, 
                apnumber, 
                floor, 
                pay,
                comment
            }
            // var {data:newOrder} = await axios.post(process.env.NEXT_PUBLIC_API+'/order', payload);
            console.log("NEW CART ", newCart)
            // setLoad(false);
            // cartFull.clear(context);
            // router.push('/orders?=complite');
        }catch(err){
            setLoad(false);
            console.log(err);
        }
    }
    return (
        <>
            <Head>
                <title>Rio Pizza</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout foodtypes={[]} menu={false} home={true}>
            <div className="container bg-white shadow mt-2">
                {complite?
                <div className="row paper m-2">
                    <h4 className="pl-4 pt-4" style={{color: 'green'}}>Заказ успешно оформлен! Номер заказа: {order && order.number}
                    </h4>
                    {/* {cart.get!=null?order.cart.map((item)=>(
                            <FoodOrder item={item} key={item._id}/>
                    )):null} */}
                    {/* <div style={{borderTop:'1px solid #e1e1e1'}}
                    className="d-flex w-100 align-items-center justify-content-end p-3">
                        <h4 className="order-amount">Итого: {order.cart.length>0?order.cart.map((g)=>g.coast*g.count).reduce((a, v)=>a+v):0} руб
                        </h4>
                    </div> */}
                </div>
                :<><div className="row paper m-2">
                    <h4 className="pl-3 pt-3">Оформление заказа</h4>
                    {/* {cart.get!=null?cart.get.map((item, i)=>(
                            <FoodOrderCart item={item} key={item.food._id} i={i}/>
                    )):null} */}
                    {/* <div style={{borderTop:'1px solid #e1e1e1'}}
                    className="d-flex w-100 align-items-center justify-content-end p-3">
                        <h4 className="order-amount">Итого: {cart.get!=null?cart.get.length>0?cart.get.map((g)=>g.coast*g.count).reduce((a, v)=>a+v):0:null} руб
                        </h4>
                    </div> */}
                </div>
                <div className="row paper m-2 row">
                    <h4 className="pl-3 pt-3 w-100">Контактная информация</h4>
                    <div className="form-group col-12 col-sm-6">
                        <label >Имя*</label>
                        <input type="text"
                        onChange={handleName} 
                        value={name}
                        className="form-control" aria-describedby="emailHelp"/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label >Номер телефона*</label>
                        <input type="text" 
                        onChange={handlePhone} 
                        value={phone}
                        placeholder="+79991112233"
                        className="form-control" aria-describedby="emailHelp"/>
                    </div>
                </div>
                <div className="row paper m-2 row">
                    <h4 className="pl-3 pt-3 w-100">Доставка</h4>
                    <div className="form-group col-12 col-sm-6">
                        <label >Город\Населенный пункт*</label>
                        <input type="text" 
                        onChange={handleCity} 
                        value={city}
                        className="form-control" aria-describedby="emailHelp"/>
                            {help?
                            <div className="dropdown-menu" style={{display:'block', left:'20px'}}>
                                {
                                    cities.filter(c=>c.name.indexOf(city.toUpperCase())>-1).map(
                                        c=>(
                                            <span 
                                            style={{cursor: 'pointer'}}
                                            onClick={(e)=>{setCity(c.name); showHelp(false)}}
                                            className="dropdown-item" href="#">
                                                {c.name}
                                            </span>
                                        ))
                                }
                            </div>
                            :null}
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label >Улица*</label>
                        <input type="text" 
                        onChange={handleAddress} 
                        value={address}
                        className="form-control" aria-describedby="emailHelp"/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label >Квартира / Дом /  Офис*</label>
                        <input type="text" 
                        onChange={handleApnumber} value={apnumber}
                        className="form-control" aria-describedby="emailHelp"/>
                    </div>
                    <div className="form-group col-12 col-sm-6">
                        <label >Этаж*</label>
                        <input type="text" 
                        onChange={handleFloor} value={floor}
                        className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                </div>
                <div className="row paper m-2 row">
                    <h4 className="pl-3 pt-3 w-100">Оплата</h4>
                    <input 
                    onChange={handlePay}
                    checked={pay=='cash'?true:false}
                    className="custom-radio" name="color" type="radio" id="cash" value="cash"/>
                    <label className="p-3" htmlFor="cash">Наличными</label>
                    <input 
                    onChange={handlePay}
                    checked={pay=='card'?true:false}
                    className="custom-radio" name="color" type="radio" id="card" value="card"/>
                    <label className="p-3" htmlFor="card">Картой</label>
                    <div className="form-group col-12">
                        <label htmlFor="exampleInputEmail1">Комментарий*</label>
                        <input type="email" 
                        onChange={handleComment} value={comment}
                        className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    {err?<div className="alert alert-danger w-100 m-2" role="alert">
                        {err}
                    </div>:null}
                    <div className="d-flex justify-content-end w-100 mb-3 mr-3">
                        <h5 className='mr-4 pt-2'>К оплате {amount} руб</h5>
                        <span 
                        // style={{width:'125px', height:'45px'}}
                        onClick={makeOrder}
                        className="btn btn-success p-2 float-right">
                            {load?<img src='/images/load.gif' alt="" style={{height:'30px', width:'30px'}}></img>:'Оформить'}    
                        </span>
                    </div>
                </div>
                </>}</div>
            </Layout>
        </>
    )
}

export default Order;

const cities = [
    {name:'ЧЕХОВ',
    min:500},
    {name:'МАНУШКИНО',
    min:700},
    {name:'ЧЕПЕЛЕВО',
    min:700},
    {name:'СОЛНЫШКОВО',
    min:700},
    {name:'СЕРГЕЕВО',
    min:700},
    {name:'РЕПНИКОВО',
    min:700},
    {name:'АЛАЧКОВО',
    min:800},
    {name:'ИВАЧКОВО',
    min:800},
    {name:'РУССКОЕ ПОЛЕ',
    min:800},
    {name:'НОВОСЕЛКИ',
    min:800},
    {name:'ГРИШЕНКИ',
    min:800},
    {name:'ДЕТКОВО',
    min:800},
    {name:'ЧУДИНОВО',
    min:800},
    {name:'ВОЛОСОВО',
    min:1200},
    {name:'СЕНИНО',
    min:1200},
    {name:'ЛЮБУЧАНЫ',
    min:1200},
    {name:'СТОЛБОВАЯ',
    min:1200},
    {name:'ПЛУЖКОВО',
    min:1200},
    {name:'ХЛЕВИНО',
    min:1200},
    {name:'БЕЛЯЕВО',
    min:1200},
    {name:'ДУБНА',
    min:1200},
    {name:'ВАСЬКИНО',
    min:1200},
    {name:'ИВАНОВСКОЕ',
    min:1200},
    {name:'КРЮКОВО',
    min:1400},
    {name:'МОЛОДИ',
    min:1400},
    {name:'ШАРАПОВО',
    min:1400},
    {name:'ВАУЛОВО',
    min:1400},
    {name:'ТРОИЦКОЕ',
    min:1400},
    {name:'БУЛЫЧЕВО',
    min:1400},
    {name:'МЕЩЕРСКОЕ',
    min:1700},
    {name:'НЕРАСТАННОЕ',
    min:1700},
    {name:'ПРОНИНО',
    min:1700},
    {name:'НОВЫЙ БЫТ',
    min:1700},
    {name:'СОЛОДОВКА',
    min:1700},
    {name:'СТРЕМИЛОВО',
    min:1700},
    {name:'ЧЕРНЕЦКОЕ',
    min:1700},
    {name:'ДОБРЫНИХА',
    min:1700},
    {name:'ТАЛАЛИХИНО',
    min:1700},
]
