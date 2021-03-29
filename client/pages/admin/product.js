import { useEffect, useState } from "react"
import Layout from "../../components/admin/layout";
import {Element as Fetcher} from '../../mylib'
import Select from 'react-select'
import axios from "axios";
import queryString from 'query-string'

export default function Product(){
    const [product, setProduct] = useState({})
    const [parameters, setParameters] = useState([])
    const [items, setItems] = useState([])
    const [selectedParameter, setSelectedParameter] = useState(null)
    const [selectedItems, setSelectedItems] = useState(null)

    if(typeof window !== "undefined"){
        let query = queryString.parse(location.search);
        var productFetcher = new Fetcher('/product?_id='+query._id, product, setProduct);
        var parametersFetcher = new Fetcher('/parameter', parameters, setParameters);
        var itemsFetcher = new Fetcher('/item', items, setItems);
    }

    useEffect(()=>{console.log(product)},[product])
    useEffect(async()=>{
        productFetcher.fetchOne();
        parametersFetcher.fetch();    
        parametersFetcher.fetch();    
        // const {data} = await axios.get(process.env.NEXT_PUBLIC_API+'/parameter');
        // const parametersData = Array.isArray(data)?data : [data];
        // console.log("PDATA ", parametersData);
        // setParameters(parametersData.map(p=>({value:p._id, label:p.name, type:p.type, available_items:p.available_items})))
    },[])

    function save(){
        const name = document.getElementById('name').value
        const description = document.getElementById('description').value
        productFetcher.updateOne({
            _id: product._id,
            name,
            description
        })
    }
    function addParameter(){
        const newValueInput = document.getElementById('singleItemValue');
        const selectedInput = (document.getElementById('selected') && document.getElementById('selected').checked) || false;
        if(!selectedParameter){alert('Параметр не выбран'); return;}
        if(!selectedItems && !newValueInput){alert('Элементы не выбраны'); return;}
        // const newSelectedParameter = parameters.find(p=>p._id===selectedParameter.value);
        const newSelectedParameter = {
            _id: selectedParameter.value,
            name: selectedParameter.label,
            items: selectedItems && selectedItems.map(si=>({_id:si.value, value: si.label})),
            value: newValueInput && newValueInput.value,
            selected: selectedInput
        }
        const oldParameters = [...product.parameters.filter(p=>(!p.deleted))]
        productFetcher.updateOne({
            _id: product._id,
            parameters: [newSelectedParameter, ...oldParameters]
        })
        reset();
    }
    function reset(){
        setSelectedParameter(null);
        setSelectedItems(null);
    }
    const handleFile = (e, _id)=>{
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        axios.post(process.env.NEXT_PUBLIC_API+`/product/upload?_id=${_id}`, formData,
            { headers: {'Content-Type': 'multipart/form-data'}}
        ).then(function(){
            productFetcher.fetch();
        })
        .catch(function(err){
            alert('Ошибка сервера!')
            console.log(err);
        });
    }
    async function onChangeParameter(selected){
        const selectedParameter = parameters.find(p=>p._id===selected.value)
        selected.type = selectedParameter.type;
        setSelectedParameter(selected);
        console.log(selectedParameter);
        (selectedParameter.type==1 || selectedParameter.type==2) &&
            setItems(selectedParameter.available_items)
        // setItems(itemsData.map(i=>({value:i._id, label:i.name})));
    }
    function removeParameter(index){
        const newParameters = [...product.parameters.filter((p,i)=>(i!=index)).map(p=>({
            _id: p._id,
            name: p.name,
            items: p.items.map(({_id, value})=>({_id, value})),
            value: p.value,
            selected: p.selected
        }))]
        productFetcher.updateOne({
            _id: product._id,
            parameters: newParameters
        })
    }
    function handleSelected(e){
        const selectedInput = document.getElementById('selected');
        console.log(selectedInput.checked)
    }
    return(
        <Layout>
            <div className='row shadow p-2 py-4 my-4' style={{backgroundColor:'white'}}>
                <h4 className='col-md-12 mb-5 rubic'>
                    Редактор продукта
                </h4>
                <div className='col'>
                    <form className='d-flex justify-content-center justify-content-md-end'>
                        <label htmlFor={product._id} style={{cursor:'pointer'}}>
                            <img 
                                alt="" 
                                height="300" 
                                width="300" 
                                className='rounded'
                                src={(!product.img || !product.img.data)?'/images/noimage.png':`data:image/jpeg;base64,${product.img.data}`}
                            />
                        </label>
                        <input type="file" id={product._id} name="file" 
                        onChange={(e)=>{handleFile(e, product._id)}} style={{display:'none'}}></input>
                    </form>
                </div>
                <div className='col'>
                    <input className='mb-2 ml-2 p-1' type='text' id='name' placeholder='Наименование'
                        defaultValue={product.name}
                    />
                    <input className='mb-2 ml-2  p-1' type='text' id='description' placeholder='Описание'
                        defaultValue={product.description}
                    />
                    <button className='btn ml-2' onClick={save}>Сохранить</button>
                    <div className='ml-2 mb-2 mt-3'>
                        <Select
                            value={selectedParameter}
                            onChange={onChangeParameter}
                            options={parameters.map(p=>({value:p._id, label:p.name}))}
                            instanceId="selectParameter"
                            placeholder='Параметр'
                        />
                    </div>
                    {selectedParameter && (selectedParameter.type===1 || selectedParameter.type===2) &&
                        <div className='ml-2 mb-2'>
                            <Select
                                value={selectedItems}
                                onChange={setSelectedItems}
                                options={items.map(i=>({value:i._id, label:i.value}))}
                                instanceId="selectItems"
                                placeholder='Элементы'
                                isMulti
                            />
                        </div>
                    }
                    
                    {selectedParameter && (selectedParameter.type===1) && 
                        <div className='ml-2 mb-2 mt-3'>
                            <input className='mr-2' type='checkbox' name='selected' id='selected' onChange={handleSelected}/>Выбраны заране (Не влияют на цену)
                        </div>
                    }
                    
                    {selectedParameter && selectedParameter.type===0 && 
                        <input className='ml-2 mb-2 w-100 p-2' type="text" id="singleItemValue" placeholder="Значение параметра"/>}

                    <button className='btn mb-2 ml-2' onClick={addParameter}>Добавить параметр</button>
                    <h5 className='ml-2'>Параметры</h5>
                    <div className='col mb-2' style={{color:'white'}}>
                        {product && product.parameters && product.parameters.map((parameter, i)=>(
                            parameter &&
                                <span key={i+'par'} className='badge bg-secondary p-2 mr-2  mb-1'>
                                    {parameter.name} {parameter.deleted && '(Не существует)'}
                                    <span className='badge bg-success mr-1'>{parameter.value}</span>
                                    {parameter.items && parameter.items.length>0 && 
                                        parameter.items.map((item,i)=>(
                                            <span key={'item'+i} className='badge bg-primary mr-1'>{item.value}</span>
                                        ))
                                    }
                                    <span className='badge bg-danger' 
                                        style={{cursor:'pointer'}}
                                        onClick={()=>{removeParameter(i)}}
                                    >
                                            X
                                    </span>
                                </span>
                        ))}
                    </div>
                    {/* <div className='col mb-2'>
                        <button className='btn' onClick={reset}>Сбросить</button>
                    </div> */}
                </div>
            </div>
        </Layout>
    )
}
