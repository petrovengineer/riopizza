import { useEffect, useState } from "react"
import {Element as ordersFetcher} from '../../mylib'
import Layout from "../../components/admin/layout"
import {formatTime} from '../../mylib'
import axios from "axios";

export default function Orders(){
    const [orders, setOrders] = useState(null);
    // const [cart, setCart] = useState(null);
    const Orders = new ordersFetcher('/order', orders, setOrders);
    useEffect(async ()=>{
        Orders.fetch();
    }, [])
    useEffect(()=>{
        console.log(orders)
    },[orders])
    return (
        <Layout>
            <h4 className='rubic my-4'>
                Заказы
            </h4>
            <div className="table-responsive p-2">
                <table className='table bg-white shadow'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>№</th>
                            <th>Время/Дата</th>
                            <th>Корзина</th>
                            <th>Клиент</th>
                            <th>Адрес</th>
                            <th>Оплата</th>
                            <th>Комментарий</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.map(o=>{
                            return (
                                <tr key={o+'ot'}>
                                    <td>{o.number}</td>
                                    <td>{formatTime(o.created)}</td>
                                    <td>
                                        {
                                            o.cart && o.cart.map(({product, count, coast, parameters}, i)=>{
                                                return (
                                                    <div className='d-flex shadow mb-2 p-1' key={'o'+i}>
                                                        <span>{(i+1)+') '+product.name}</span>
                                                        <span>
                                                            {parameters.map((p,i)=>{
                                                                if(p.parameter && p.parameter.type!==0){
                                                                    if(p.parameter.selected){
                                                                        return <span key={'pi'+i} className='badge bg-danger white ml-2'>
                                                                                    Исключить: {p.items.map(i=>(i.name))}
                                                                                </span>
                                                                    }
                                                                    else{
                                                                        return <span key={'pi'+i} className='badge bg-success white ml-2'>
                                                                            {p.parameter.name} {p.items && p.items.map(i=>(i.name))} {p.parameter.unit}
                                                                        </span>
                                                                    }
                                                                }
                                                            })}
                                                        </span>
                                                        <div className='d-flex'><span>{count*coast} </span><span>руб</span></div>
                                                    </div>
                                                )})
                                        }
                                    </td>
                                    <td>
                                        {o.phone + ' '+ o.name}
                                    </td>
                                    <td>
                                        {o.address+', этаж: '+o.floor+', кв: '+o.apnumber}
                                    </td>
                                    <td>
                                        {o.pay==='cash' && <span>Наличные</span>}
                                        {o.pay==='card' && <span>Картой</span>}
                                    </td>
                                    <td>
                                        {o.comment}
                                    </td>
                                    <td>
                                        {o.status===0?'Не подтверждён':o.status===1?'Принят':o.status===2?'Доставка':o.status===3?'Завершён':''}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}