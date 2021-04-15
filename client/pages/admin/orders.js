import { useEffect, useState } from "react"
import {Element as ordersFetcher} from '../../mylib'
import Order from "../../components/admin/order";
import Layout from '../../components/layout';
import Table from '../../components/table';

export default function Orders(){
    const [orders, setOrders] = useState(null);
    const Orders = new ordersFetcher('/order', orders, setOrders);
    const [skip, setSkip] = useState(0);
    const [pages, setPages] = useState([]);
    const limit = 15;

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
        <Layout>
        <div className='container-fluid' style={{position: 'relative'}}>
            <div className='p-2'>
                Страницы:
                {pages.map(p=><span key={'page'+p} className='link mx-2' onClick={()=>{setSkip(p*limit)}}>{p+1}</span>)}
            </div>
            <Table head={['№','Время','Корзина','Клиент','Адрес','Оплата','Комментарий','Статус',]}>
                {orders && orders.map((o, i)=>{
                    return <Order key={'order'+i} order={o} index={i} ordersFetcher={Orders}/>
                })}
            </Table>
        </div>
        </Layout>
    )
}