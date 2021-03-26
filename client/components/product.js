import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Product({product}){
    let {_id, name = 'No name', description = '', img, parameters} = product;
    const [composition, setComposition] = useState(null);
    const [price, setPrice] = useState(null);
    useEffect(()=>{
        setComposition(parameters.find(p=>(p.name==='Состав')));
        setPrice(parameters.find(p=>(p.name==='Цена')));
    }, [parameters])
    return (
        <div className='col-sm-6 col-md-6 col-lg-4 col-xl-3 rounded '>
            <div className='shadow'>
            <img src={img && img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'} style={{width: '100%'}}/>
            <div className='product p-5 p-sm-4'>
                <div className='d-flex flex-column justify-content-between' style={{height:'220px'}}>
                    <h5 className='mb-0' style={{minHeight:'50px'}}>
                        <Link href={'/products/'+_id}>{name}</Link><br/>
                    </h5>
                    <div style={{wordWrap:'break-word'}} className='mb-4'>
                        {composition && composition.items && composition.items.map((item,i)=>(
                            <span className='mr-2 composition' key={'item'+i}>{item.value}</span>
                        ))}
                    </div>
                    <div className='d-flex justify-content-between '>
                        <span className='' style={{fontSize:'26px', fontWeight:'900'}}>{price && price.value+''}
                            <i className="fas fa-ruble-sign ml-1" style={{fontWeight:'900', fontSize:'22px'}}></i>
                        </span>
                        <div className="cart-opt">
                                <a href="#">
                                    <span className='mr-2'>
                                        <i class="fas fa-heart"></i>
                                    </span>
                                </a>
                                <Link href={'/products/'+_id}>
                                        <a href="#">
                                            <span>
                                                <i className="fas fa-shopping-basket"></i>
                                            </span>
                                        </a>
                                </Link>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}