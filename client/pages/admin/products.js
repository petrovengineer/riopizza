import { useEffect, useState } from "react"
import Layout from "../../components/admin/layout";
import {Element} from '../../mylib';
import Link from "next/link";
import Panel from "../../components/admin/panel"
import Modal from "../../components/modal"
import Table from "../../components/table"
import Select from 'react-select'

export default function Products(){
    const typeId = "605530346336510160aaa186";
    const [products, setProducts] = useState([]);
    const [updateId, setUpdateId] = useState(null);
    const [modal, setModal] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState({value:0, label: 'Все'});
    const Product = new Element('/product', products, setProducts);

    useEffect(async ()=>{
        const dataProduct = await Product.fetchWithPromise();
        setProducts(Array.isArray(dataProduct)?dataProduct:[dataProduct]);
    },[])
    useEffect(()=>{
        let types = [{value:0, label: 'Все'}];
        // console.log("PRODUCTS", products)
        products.map(({parameters=[]})=>{
            let typeParameter = parameters.find(p=>p.name==='Тип');
            if(typeParameter){
                let {items:typeItems=[]} = typeParameter;
                typeItems.map(ti=>{
                    if(!types.find(t=>t.value===ti._id)){
                        types.push({value: ti._id, label: ti.value});
                    }
                })
            } 
        })
        setTypes(types);
        // console.log("TYPES", types);
    }, [products])
    useEffect(()=>{
        console.log(modal)
    }, [modal])
    function create(){
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const parameters = [];
        if(selectedType && selectedType.value!=0){
            parameters.push({
                _id: typeId, 
                name:'Тип', 
                items:{_id: selectedType.value, value: selectedType.label},
                selected: false,
            });
        }
        Product.create({name, description, parameters});
        closeModal();
    }
    function remove(_id){
        Product.remove(_id);
    }
    function closeModal(){
        const newModal = [...modal]; 
        newModal.splice(modal.indexOf('new'),1); 
        setModal(newModal);
    }
    return(
        <Layout>
            <Panel>
                <button className='btn btn-success' onClick={()=>{modal.indexOf('new')<0?setModal([...modal, 'new']):null}}>Новый продукт</button>
                <div style={{minWidth:'200px'}}>
                    <Select
                        value={selectedType}
                        onChange={(selected)=>{setSelectedType(selected)}}
                        options={types}
                        instanceId="selectType"
                        placeholder='Тип'
                    />
                </div>
            </Panel>
            {modal.indexOf('new')>=0 && 
                <Modal close={closeModal}>
                    <span>Новый продукт</span>
                    <div>
                        <div className='col mb-2'>
                            <input type='text' id='name' placeholder='Наименование'/>
                        </div>
                        <div className='col mb-2'>
                            <input type='text' id='description' placeholder='Описание'/>
                        </div>
                    </div>
                    <div>
                        {updateId &&<div className='col mb-2'>
                            <button className='btn mr-2'>Сохранить</button>
                            <button className='btn' onClick={reset}>Отмена</button>
                        </div>}
                        {!updateId && <div className='col mb-2'>
                            <button className='btn' onClick={create}>Создать</button>
                        </div>}
                    </div>
                </Modal>
            }
            <div className='row'>
                <Table head={['Наименование', 'Описание', 'Параметры', 'Изображение', 'Действия']} theadDark>
                    {products
                    .filter(({parameters=[]})=>{
                        if(selectedType.value===0){return true}
                        else{
                            let typeParameter = parameters.find(p=>p.name==='Тип');
                            if(typeParameter){
                                let {items:typeItems=[]} = typeParameter;
                                let count = typeItems.filter(ti=>{
                                    if(selectedType.value===ti._id){
                                        return true;
                                    }
                                }).length;
                                if(count){return true}else{return false}
                            }
                        }
                    })
                    .map((product,i)=>(
                        <tr key={i+'prod'}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td style={{color:'white'}}>
                                {product.parameters && product.parameters.map((parameter, i)=>(
                                        <span key={i+'param'} className='badge bg-primary mr-1 p-1'>{parameter.name}</span>
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
                            <td className='d-flex'>
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
                </Table>
            </div>
        </Layout>
    )
}