import Layout from '../components/layout'
import Table from '../components/table'
import {useContext, useEffect} from 'react'
import AppContext from '../context'
import Link from 'next/link'

export default function Favorite(){
    const context = useContext(AppContext);
    const {favorite} = context;
    useEffect(()=>{
        if(favorite){
            console.log(favorite);
        }
    }, [favorite])
    function remove(index){
        const newFavorite = [...favorite.value]
		favorite.set(context, newFavorite.filter((f,i2)=>(i2!=index)));
	}
    return (
        <Layout>
            <div className='container position-relative'>
                <div className='row px-3'>
                    <h3 className='w-100 rubic mt-4 mb-2 '>
                        Избранное
                    </h3>
                    {favorite && favorite.value && (favorite.value.length>0?<Table head={['','Название', 'Состав', 'Цена', '']}>
                        {
                            favorite && favorite.value.map((item,i)=>(
                                <tr>
                                    <td>				
                                        <img 
                                            className='rounded mr-1'
                                            width="40"
                                            src={item.img.data?`data:image/jpeg;base64,${item.img.data}`:'/images/pizza.jpg'}
                                        />
                                        
                                     </td>
                                    <td>{item.name}</td>
                                    <td style={{minWidth:'200px'}}>{item.description}</td>
                                    <td>{item.parameters.find(p=>p.name==='Цена').value}</td>
                                    <td className='d-flex pt-3'>
                                        <Link href={'/products/'+item._id}>
                                            <i className="fas fa-shopping-cart mr-3 cart-icon"></i>
                                        </Link>
                                        <i className="fas fa-trash remove-icon" onClick={()=>remove(i)}></i>                                        
                                    </td>
                                </tr>
                            ))
                        }
                    </Table>:'В избранном пока пусто...')}
                </div>
            </div>
        </Layout>
    )
}