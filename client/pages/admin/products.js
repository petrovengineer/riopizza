import { useEffect, useState } from "react"
import Layout from "../../components/admin/layout";
import {Element} from '../../mylib';
import Link from "next/link";

export default function Products(){
    const [products, setProducts] = useState([]);
    const [updateId, setUpdateId] = useState(null);
    const Product = new Element('/product', products, setProducts);
    useEffect(async ()=>{
        const dataProduct = await Product.fetchWithPromise();
        setProducts(Array.isArray(dataProduct)?dataProduct:[dataProduct]);
    },[])
    // useEffect(()=>{
    //     console.log(products)
    // }, [products])
    function create(){
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        Product.create({name, description});
    }
    function remove(_id){
        Product.remove(_id);
    }
    return(
        <Layout>
            <h2>
                Продукты
            </h2>
            <div className='col mb-2'>
                <input type='text' id='name' placeholder='Наименование'/>
            </div>
            <div className='col mb-2'>
                <input type='text' id='description' placeholder='Описание'/>
            </div>
            {updateId &&<div className='col mb-2'>
                <button className='btn mr-2'>Сохранить</button>
                <button className='btn' onClick={reset}>Отмена</button>
            </div>}
            {!updateId && <div className='col mb-2'>
                    <button className='btn' onClick={create}>Создать</button>
                </div>}
            <table className='table'>
                <thead className='thead-dark'>
                    <tr>
                        <th>Наименование</th>
                        <th>Описание</th>
                        <th>Параметры</th>
                        <th>Изображение</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product,i)=>(
                        <tr key={i+'prod'}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td style={{color:'white'}}>
                                {product.parameters && product.parameters.map((parameter, i)=>(
                                        <span key={i+'param'} className='badge bg-secondary'>{parameter.name}</span>
                                ))}
                            </td>
                            <td>   
                                <img 
                                    alt="" 
                                    height="100" 
                                    width="100" 
                                    src={(!product.img || !product.img.data)?'/images/noimage.png':`data:image/jpeg;base64,${product.img.data}`}
                                />
                            </td>
                            <td>
                                <button className='btn mr-2' onClick={()=>{remove(product._id)}}>Удалить</button>
                                <Link 
                                    href={'/admin/product?_id='+product._id}
                                    as={'/admin/product?_id='+product._id}
                                >
                                    <button className='btn'>Изменить</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}