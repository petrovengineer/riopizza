import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import AppContext from '../context'


export default function Product({product}){
    let {_id, name = 'No name', description = '', img} = product;
    // const [composition, setComposition] = useState(null);
    const [price, setPrice] = useState(null);
    const [alert, setAlert] = useState(false)
    const context = useContext(AppContext);
    useEffect(()=>{
        // setComposition(product.parameters.find(p=>(p.name==='Состав')));
        setPrice(product.parameters.find(p=>(p.name==='Цена')));
    }, [])
    function addToFavorite(){
        let newCart = [];
        if(context.favorite.value){newCart.push(...context.favorite.value)}
        newCart.push(
            product
            // {
            //     product,
            //     img: product.img,
            //     name: product.name,
            // }
        );
        context.favorite.set(context, newCart)
        setAlert(true);
    }
    return (
        <div className='col-sm-6 col-md-6 col-lg-4 col-xl-3 px-4 px-sm-3 rounded'>
            <div className='shadow'>
            <img loading="lazy" src={img && img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'} className='w-100'/>
            <div className='product p-5 p-sm-4'>
                <div className='d-flex flex-column justify-content-between' style={{height:'220px'}}>
                    <h5 className='mb-0' style={{minHeight:'50px'}}>
                        <Link href={'/products/'+_id}>{name}</Link><br/>
                    </h5>
                    {/* <div style={{wordWrap:'break-word'}} className='mb-4'>
                        {composition && composition.items && composition.items.map((item,i)=>(
                            <span className='mr-2 composition' key={'item'+i}>{item.value}</span>
                        ))}
                    </div> */}
                    {!alert && <div style={{wordWrap:'break-word'}} className='mb-4' style={{fontSize:'12px'}}>
                        {product.description}
                    </div>}
                    {alert && <div className='alert alert-warning py-2'>
                    Товар добавлен в избранное!
                    </div>}
                    <div className='d-flex justify-content-between '>
                        <span className='mt-2' style={{fontSize:'24px', fontWeight:'900'}}>{price && price.value+''}
                            <i className="fas fa-ruble-sign ml-1" style={{fontWeight:'900', fontSize:'22px'}}></i>
                        </span>
                        <div className="cart-opt">
                                {/* <a href="javascript:void(0)" onClick={addToFavorite}> */}
                                    <span className='mr-2'  onClick={addToFavorite}>
                                        <i className="fas fa-heart"></i>
                                    </span>
                                {/* </a> */}
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