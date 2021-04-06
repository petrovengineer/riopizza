import { useEffect, useState } from "react"
import {Element as ordersFetcher} from '../../mylib'
// import Layout from "../../components/admin/layout"
// import axios from "axios";
import Order from "../../components/admin/order";

export default function Orders(){
    const [orders, setOrders] = useState(null);
    // const [cart, setCart] = useState(null);
    const Orders = new ordersFetcher('/order', orders, setOrders);
    useEffect(async ()=>{
        Orders.fetch();
    }, [])

    // useEffect(()=>{
    //     console.log(orders)
    // },[orders])
    return (
        // <Layout>
        <div className='container-fluid'>
            <h4 className='rubic my-4'>
                Заказы
            </h4>
            <div className="table-responsive p-2">
                <table className='table table-hover shadow'>
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
                        {orders && orders.map((o, i)=>{
                            return <Order order={o} index={i} ordersFetcher={Orders}/>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        // </Layout>
    )
}