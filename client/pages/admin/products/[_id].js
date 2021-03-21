import { useEffect, useState } from "react"
import Layout from "../../../components/admin/layout";
import {Element} from '../../../mylib'
import Select from 'react-select'
import axios from "axios";
import { useRouter } from 'next/router'

export default function Product(){
    const router = useRouter()
    const query = router.query
    const [product, setProduct] = useState({})
    const [parameters, setParameters] = useState([])
    const [items, setItems] = useState([])
    const [selectedParameter, setSelectedParameter] = useState(null)
    const [selectedItems, setSelectedItems] = useState(null)
    // const Product = new Element('/product?_id='+_id, product, setProduct);
    useEffect(()=>{
        console.log("ID ", query)
        // Product.fetch();
    },[])
    function save(){

    }
    function reset(){

    }
    const handleFile = (e, _id)=>{
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        axios.post(`/product/upload?_id=${_id}`, formData,
            { headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function(){
            Product.fetch();
        })
        .catch(function(err){
            alert('Ошибка сервера!')
            console.log(err);
        });
    }
    async function onChangeParameter(selectedParameter){
        setSelectedParameter(selectedParameter);
        try{
            const {data: parameter} = await axios.get('/parameter?_id='+selectedParameter.value);
            if(parameter.type===0){
                
            }
            if(parameter.type==1 || parameter.type==2){
                let availableItems = parameter.available_items;
                setItems(availableItems.map(a=>({value: a.item_id, label: a.value})))
            }
        }
        catch(e){
            console.log(e);
        }
        // setItems(itemsData.map(i=>({value:i._id, label:i.name})));
    }
    return(
        <Layout>
            <div className='row'>
                <div className='col-md-6'>
                    <form>
                        <label htmlFor={product._id} style={{cursor:'pointer'}}>
                            <img 
                                alt="" 
                                height="300" 
                                width="300" 
                                src={product.img==null?'/images/noimage.png':`data:image/jpeg;base64,${product.img.data}`}
                            />
                        </label>
                        <input type="file" id={product._id} name="file" 
                        onChange={(e)=>{handleFile(e, product._id)}} style={{display:'none'}}></input>
                    </form>
                </div>
                <div className='col-md-6'>
                    <input className='mb-2 ml-2' type='text' id='name' placeholder='Наименование'/>
                    <input className='mb-2 ml-2' type='text' id='description' placeholder='Описание'/>
                    <div className='ml-2 mb-2'>
                        <Select
                            value={selectedParameter}
                            onChange={onChangeParameter}
                            options={parameters}
                            instanceId="selectParameter"
                            placeholder='Параметр'
                        />
                    </div>
                    {selectedParameter && 
                        <div className='col-6 mb-2'>
                            <Select
                                value={selectedItems}
                                onChange={setSelectedItems}
                                options={items}
                                instanceId="selectItems"
                                placeholder='Элементы'
                            />
                        </div>}
                    {/* {(parameter.type===0) &&  */}
                        {/* <input type="text" id="singleItemValue" placeholder="Значение параметра"/>} */}
                    <button className='btn mb-2 ml-2'>Добавить параметр</button>
                    <h5>Параметры</h5>
                    <div className='col mb-2'>
                        <span className='badge bg-secondary'>123</span>
                    </div>
                    <div className='col mb-2'>
                        <button className='btn mr-2' onClick={save}>Сохранить</button>
                        <button className='btn' onClick={reset}>Сбросить</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}