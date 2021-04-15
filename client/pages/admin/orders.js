import { useEffect, useState } from "react"
import {Element as ordersFetcher} from '../../mylib'
// import Layout from "../../components/admin/layout"
// import axios from "axios";
import Order from "../../components/admin/order";

export default function Orders(){
    const [orders, setOrders] = useState(null);
    const Orders = new ordersFetcher('/order', orders, setOrders);
    const [skip, setSkip] = useState(0);
    const [pages, setPages] = useState([]);
    const limit = 2;

    useEffect(async ()=>{
        let {count: fetchedCount} = await Orders.count();
        // setCount(+fetchedCount);
        // let args = {limit, skip};
        // Orders.fetch(args);
        console.log("COUNT ", fetchedCount)
        let pages = parseInt(fetchedCount/limit)+1;
        if(fetchedCount%limit===0){pages--}
        console.log("PAGES ", pages);
        let pageItems = [];
        for(let i=0; i<pages; i++){
            pageItems.push(i)
        }
        console.log(pageItems);
        setPages(pageItems);
    }, [])

    useEffect(()=>{
        console.log("SKIP ", skip)
        let args = {limit, skip};
        Orders.fetch(args);
    }, [skip])
    // useEffect(()=>{
    //     console.log(orders)
    // },[orders])
    

    return (
        // <Layout>
        <div className='container-fluid'>
            <h4 className='rubic my-4'>
                Заказы
            </h4>
            {pages.map(p=><span key={'page'+p} className='link mr-2' onClick={()=>{setSkip(p*limit)}}>{p+1}</span>)}
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
                            return <Order key={'order'+i} order={o} index={i} ordersFetcher={Orders}/>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        // </Layout>
    )
}