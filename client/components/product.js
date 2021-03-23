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
        <div className='col-sm-6 col-md-4 col-lg-3'>

            <div className='product'>
                <img 
                    src={img && img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'} style={{width: '100%'}}

                />
                <div className='d-flex flex-column justify-content-between' style={{height:'220px'}}>
                    <h5 className='mb-0'>
                        <Link href={'/products/'+_id}>{name}</Link><br/>
                    </h5>
                    <div style={{wordWrap:'break-word'}} className='mb-4'>
                        {composition && composition.items && composition.items.map((item,i)=>(
                            <span className='mr-2 composition' key={'item'+i}>{item.value}</span>
                        ))}
                    </div>
                    <div className='d-flex justify-content-between '>
                        <span className='price'>{price && price.value+'руб'}
                            {/* <i class="fas fa-ruble-sign"></i> */}
                        </span>
                        <div className="cart-opt">
                            <span className='mr-2'>
                                <a href="#"><i class="fas fa-heart"></i></a>
                            </span>
                            <span>
                                <a href="single-food.html"><i className="fas fa-shopping-basket"></i></a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}