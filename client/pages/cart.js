import Head from 'next/head'
// import Link from 'next/link'
import AppContext from '../context'
import { useContext, useEffect, useState } from 'react'
import Layout from '../components/layout';
import Link from 'next/link'

export default function Basket(){
	const context = useContext(AppContext);
	let {cart:{value:cart=[]}} = context;
	let amount = 0; 
    cart && cart.map(({affects, parameters, count})=>{
        const coast = affects.filter(a=>(a.parameter.name==='Цена')).map(a=>(a.value)).reduce((acc, cur)=>(+acc + +cur),0) + (parameters['Цена']?+parameters['Цена'].value:0);
        amount = amount + (coast*count);
    })
	useEffect(()=>{
		console.log("CART ", cart)
	}, [cart])
	function removeFromCart(index){
		const newCart = [...cart]
		context.cart.set(context, newCart.filter((f,i2)=>(i2!=index)));
	}
	return(
		<Layout>
			<Head>
				<title>Корзина</title>
			</Head>
			<div className='container position-relative'>
				<div className='row px-3'>
					<h3 className='w-100 rubic mt-4 mb-2 '>
						Корзина
					</h3>
					{(!cart || cart.length===0) ?<h5>В корзине пока пусто...</h5>:<>
					<div className='table-responsive shadow bg-white'>
						<table className='table'>
							<thead>
								<tr>
									<th></th>
									<th>Название</th>
									<th>Параметры</th>
									<th>Цена</th>
									<th>Количество</th>
									<th>Итого</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{cart && cart.map((item, i)=>(
								<CartItem item={item} index={i} key={'item'+i} removeFromCart={removeFromCart}/>
								))}
							</tbody>
						</table>
					</div>
					<div className='d-flex justify-content-end mt-4' style={{width:'100%'}}>
                        <h5 className='mr-4 pt-2' style={{fontWeight:'900'}}>К оплате {amount} руб</h5>
						<Link href={'/checkout'}>
							<button className='btn btn-danger' style={{float:'right'}}>Оформить</button>
						</Link>
					</div>
					</>
					}
				</div>
			</div>
		</Layout>
)}

function CartItem({item, index, removeFromCart}){
	const context = useContext(AppContext);
	const {name = 'Неизвестно', img = {}, parameters = {}, affects=[]} = item;
	let coast = !affects?0:affects.length===0?0:affects
		.filter(a=>(a.parameter.name==='Цена'))
		.map(a=>(a.value))
		.reduce((acc, cur)=>(+acc + +cur),0); 
	coast = coast + +(parameters['Цена']?+parameters['Цена'].value:0);
	useEffect(()=>{
		console.log("ITEM ", item)
	}, [])
	function handleCount(value){
		console.log("VALUE", value)
		let newCart = [];
		if(context.cart.value){newCart.push(...context.cart.value)}
		newCart[index].count = value.length<3?(+value.replace(/[^\d]/g, '') || 0):newCart[index].count
		console.log("NEW CART", newCart)
		context.cart.set(context, newCart)
		// setCount(e.target.value.length<3?(+e.target.value.replace(/[^\d]/g, '') || 0):count)
	}
	function handleRemove(index){
		console.log(index)
		removeFromCart(index)
		// const updated = [...cart.get];
        // cart.set(updated.filter((f,i2)=>(i2!=i)));
	}
	return(
		<tr>
			<td className=''>
				<img 
					className='rounded mr-1'
					width="40"
					src={(img && img.data)?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'}
				/>
			</td>
			<td>
				{name}
			</td>
			<td>
				{Object.keys(parameters).map((key, i)=>{
						if(Array.isArray(parameters[key].items)){
							return (
								parameters[key].parameter && parameters[key].parameter.selected===false ?
									<span key={'p'+i} className='badge bg-secondary mr-1' style={{color: 'white'}}>{key}
										{parameters[key].items.map((p, i)=>(
											<span key={'pk'+i} className='badge bg-success ml-1'>{p.value}</span>
										))}
									</span>:
									<span key={'p'+i} className='badge bg-secondary mr-1' style={{color: 'white'}}>
										Исключить: 
										{parameters[key].items.map((p,i)=>(
											<span key={'pp'+i} className='badge bg-danger ml-1'>{p.value}</span>
										))}
									</span>
							)
						}else{
							return (parameters[key].parameter && parameters[key].parameter.type!==0 && !parameters[key].parameter.selected && <span key={'p'+i} className='badge bg-secondary mr-1' style={{color:'white'}}>{key}
								<span className='badge bg-success ml-1'>{parameters[key].items.value + parameters[key].parameter.unit}</span>
							</span>)
						}
					})
				}
			</td>
			<td>
				{coast?coast+'руб':'По запросу'}
				{/* {affects.filter(a=>(a.parameter.name==='Цена')).map(a=>(a.value)).reduce((acc, cur)=>(+acc + +cur),0) + +parameters['Цена'].label} */}
			</td>
			<td>
				<i className="fas fa-minus-circle btn-remove mr-2" onClick={(e)=>{handleCount((item.count-1>0?item.count-=1:1))}}></i>
				<input type="text" size='1' id='count' value={item.count} onChange={(e)=>handleCount(e.target.value)}/>
				<i className="fas fa-plus-circle btn-remove ml-2" onClick={(e)=>{handleCount(item.count+=1);}}></i>
			</td>
			<td>
				<span>{+coast*context.cart.value[index].count} руб</span>
			</td>
			<td>
				<i className="fas fa-trash btn-remove" onClick={()=>handleRemove(index)}></i>
			</td>
		</tr>
	)
}