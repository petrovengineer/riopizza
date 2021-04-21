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
    const [online, setOnline] = useState(false);
    let connection = null;

    useEffect(async ()=>{
        await count();
        if((typeof window != 'undefined') && !connection){
            connect();
        }
    }, [])

    useEffect(()=>{
        let args = {limit, skip};
        Orders.fetch(args);
    }, [skip])

    function count(){
        return new Promise(async (done, fail)=>{
            let {count: fetchedCount} = await Orders.count();
            let pages = parseInt(fetchedCount/limit)+1;
            if(fetchedCount%limit===0){pages--}
            let pageItems = [];
            for(let i=0; i<pages; i++){
                pageItems.push(i)
            }
            setPages(pageItems);
            done();
        })
    }

    function connect(){
        connection = new WebSocket(process.env.NEXT_PUBLIC_WS || 'ws://localhost');
        connection.onopen = () => {
            setOnline(true);
        }
        connection.onerror = error => {
            console.log(`WebSocket error: ${error}`)
        }
        connection.onmessage = async e => {
            console.log("Message from server: ",e.data)
            if(e.data==='refresh'){
                await count();
                let args = {limit, skip};
                Orders.fetch(args);
            }
        }
        connection.onclose = (ev) => {
            console.log("Closed connection!")
            setOnline(false);
        }
    }

    return (
        <Layout>
        <div className='container-fluid' style={{position: 'relative'}}>
            <div className='d-flex justify-content-between'>
                <div className='p-2'>
                    Страницы:
                    {pages.map(p=><span key={'page'+p} className='link mx-2' onClick={()=>{setSkip(p*limit)}}>{p+1}</span>)}
                </div>
                {online?<span style={{color: "green"}} className='p-2'>Online</span>:<span style={{color: "red"}} className='p-2'>Offline</span>}
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