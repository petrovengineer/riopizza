import Head from 'next/head'
import { useEffect, useState } from 'react'
import Layout from '../components/layout';
import axios from 'axios';
import AppContext from '../context';
import { useContext } from 'react';


export default function Orders(){
	const context = useContext(AppContext);
	const {user, accessToken, orders: ordersLocal} = context;
    const [orders, setOrders] = useState(null)
    useEffect(async ()=>{
		console.log("ACCESS TOKEN", accessToken)
		if(accessToken && accessToken.value){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken.value;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
			const {data=[]} = await axios.get(process.env.NEXT_PUBLIC_API+'/order');
			console.log("SET DATA")
			setOrders(data)
		}
		else if((!accessToken || !accessToken.value) && (ordersLocal && ordersLocal.value)){
			console.log("SET LOCAL IN TOKEN")
			setOrders(ordersLocal.value)
		}
    },[accessToken && accessToken.value])
    useEffect(()=>{
		console.log("ORDERS Local",ordersLocal)
		if((!accessToken || !accessToken.value) && (ordersLocal && ordersLocal.value)){
			console.log("SET LOCAL")
			setOrders(ordersLocal.value)
		}
	},[ordersLocal])
    return(
        <Layout>
			<Head>
				<title>Заказы</title>
			</Head>
			<div className='container'>
				<div className='row px-3'>
					<h4 className='mt-4 mb-2 w-100 rubic'>
						Заказы {(!accessToken || !accessToken.value) && 'без авторизации'}
					</h4>
					{(!orders || orders.length===0) ?<h5>Заказов пока нет...</h5>:
						<div className='table-responsive shadow bg-white'>
							<table className='table '>
								<thead>
									<tr>
										<th>№</th>
										<th>Время</th>
										<th>Состав</th>
										<th>Сумма</th>
										<th>Оплата</th>
										<th>Статус</th>
									</tr>
								</thead>
								<tbody>
									{orders && orders.map((order, i)=>(
										<Order key={'order'+i} order={order} index={i} />
									))}
								</tbody>
							</table>
						</div>
					}
				</div>
			</div>
		</Layout>
    )
}

function Order({order:{number, created, cart, pay, status}}){
	const [count, setCount] = useState(1)
	const coast = cart.reduce((acc, cur)=>((cur.count*cur.coast)+acc),0);
	useEffect(()=>{

	}, [])
    const formatTime = (iso)=>{
        const addZero = (num)=>{
            return num<10?'0'+num:num
        }
        let date = new Date(iso)
        return addZero(date.getHours()) +':'+addZero(date.getMinutes()) +' '+addZero(date.getDate()) +'.'+Number.parseInt(date.getMonth()+1)+'.'+date.getFullYear()
    }
	return(
		<tr>
			<td>
				{number}
			</td>
			<td>
                {formatTime(created)}
			</td>
			<td style={{color: 'white'}}>
				{cart.map((item,i)=>(
                    <span className='badge bg-secondary mr-2' key={'ci'+i}>
                        {item.product.name}
                        {item.parameters.map((p,i)=>{
                            if(p.parameter && p.parameter.type!==0){
                                if(p.parameter.selected){
                                    return <span key={'pi'+i} className='badge bg-danger ml-2'>
                                                Исключить: {p.items.map(i=>(i.name))}
                                            </span>
                                }
                                else{
                                    return <span key={'pi'+i} className='badge bg-success ml-2'>
                                        {p.parameter.name} {p.items && p.items.map(i=>(i.name))} {p.parameter.unit}
                                    </span>
                                }
                            }
                        })}
                    </span>
                ))}
			</td>
			<td>
				{coast}
			</td>
			<td>
                {pay==='cash'?'Наличные':'Карта'}
			</td>
			<td>
                {status===0?'Не подтверждён':status===1?'Принят':status===2?'Доставка':status===3?'Завершён':''}
			</td>
		</tr>
	)
}
