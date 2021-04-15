import {formatTime} from '../../mylib'
import {useState} from 'react'
import Select from 'react-select';

export default function Order({order: o, index, ordersFetcher}){
    const statusList = [
        {value: 0, label:'Новый'},
        {value: 1, label:'Принят'},
        {value: 2, label:'Доставка'},
        {value: 3, label:'Получен'},
    ]
    const [selectedStatus, setSelectedStatus] = useState({value: o.staus, label:statusList.find(s=>s.value===o.status).label});
    function handleChangeStatus(selected){
        ordersFetcher.update({
            _id: o._id,
            status: selected.value
        })
        setSelectedStatus(selected)
    }
    return(
        <tr>
            <td className={'white '+(o.status===0?'bg-danger':o.status===1?'bg-warning':o.status===2?'bg-primary':o.status===3?'bg-success':'')}>{o.number}</td>
            <td>{formatTime(o.created)}</td>
            <td>
                <table className='table table-bordered table-sm'>
                    <tbody>
                        {
                            o.cart && o.cart.map(({product, count, coast, parameters}, i)=>{
                                return (
                                    <tr key={'o'+i}>
                                        <td>{(i+1)+'. '}</td>
                                        <td>{product.name}</td>
                                        <td>
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
                                        </td>
                                        <td className='d-flex'><span>{count*coast} </span><span>руб</span></td>
                                    </tr>
                                )})
                        }
                    </tbody>
                </table>
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
            <td style={{minWidth:'150px'}}>
                {o.status<3?
                <Select
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    options={statusList.filter(s=>(s.value===o.status+1))}
                    instanceId={"selectStatus"+index}
                    placeholder='Статус'
                />
                :<span>{statusList.find(s=>s.value===o.status).label}</span>}
            </td>
        </tr>
    )
}