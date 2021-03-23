import Head from 'next/head'
// import Link from 'next/link'
import AppContext from '../context'
import { useContext, useEffect, useState } from 'react'
import Layout from '../components/layout';
export default function Basket(){
	const context = useContext(AppContext);
	let {cart:{value:cart=[]}} = context;
	useEffect(()=>{
		console.log("CART ", cart)
	}, [cart])
	return(
		<Layout>
			<Head>
				<title>Корзина</title>
			</Head>
			<div className='container'>
				<div className='row'>
					<h2 className='mt-4'>
						Корзина
					</h2>
					<table className='table' style={{backgroundColor:'white'}}>
						<thead>
							<tr>
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
								<CartItem item={item} key={'item'+i}/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
)}

function CartItem({item}){
	const [amount, setAmount] = useState(0)
	const {name = 'Неизвестно', img = {}, parameters = {}, affects=[]} = item;
	useEffect(()=>{
		console.log("ITEM ", item)
	}, [])
	return(
		<tr>
			<td className=''>
				<img 
					className='rounded mr-1'
					width="40"
					src={img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'}
				/>
				{name}
			</td>
			<td>
				{Object.keys(parameters).map((key)=>{
						if(Array.isArray(parameters[key])){
							return (
									<span className='badge bg-secondary mr-1' style={{color: 'white'}}>{key}
									{parameters[key].map((p)=>(
										<span className='badge bg-danger ml-1'>{p.label}</span>
									))}
									</span>
							)
						}else{
							return (parameters[key].type!==0 && <span className='badge bg-secondary' style={{color:'white'}}>{key}
								<span className='badge bg-danger ml-1'>{parameters[key].label}</span>
							</span>)
						}
					})
				}
			</td>
			<td>
				{affects.filter(a=>(a.parameter.name==='Цена')).map(a=>(a.value)).reduce((acc, cur)=>(+acc + +cur),0) + +parameters['Цена'].label}
			</td>
			<td>
				
			</td>
			<td>
				
			</td>
		</tr>
	)
}