import axios from 'axios'
import Select from 'react-select';
import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"

export default function Parameters(){
    const [parameters, setParameters] = useState([])
    const [items, setItems] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedType, setSelectedType] = useState({ value: 0, label: 'Одно значение' });
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [updateId, setUpdateId] = useState(null);
    const Parameter = new Element('/parameter', parameters, setParameters);
    const types = [
        { value: 0, label: 'Одно значение' },
        { value: 1, label: 'Множественный выбор' },
        { value: 2, label: 'Одиночный выбор' },
      ];
    useEffect(async ()=>{
        const dataParameters = await Parameter.fetchWithPromise();
        setParameters(Array.isArray(dataParameters)?dataParameters:[dataParameters]);
        const {data: itemData} = await axios.get('/item');
        setItems(itemData.map(i=>({value:i._id, label:i.value})));
        const {data: groupData} = await axios.get('/group');
        setGroups(groupData.map(i=>({value:i._id, label:i.name})));
    },[])
    function reset(){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const valueInput = document.getElementById("value");
        nameInput.value = '';
        unitInput && (unitInput.value = '');
        valueInput && (valueInput.value = '');
        setSelectedItem([]);
        setSelectedGroup(null);
        // setSelectedType(null);
        setUpdateId(null);
    }
    function create(){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const valueInput = document.getElementById("value");
        Parameter.create({
            name: nameInput.value,
            type: selectedType.value,
            unit: unitInput?unitInput.value:null,
            value: valueInput?valueInput.value:null,
            available_items: selectedItem.map(s=>({value:s.label, _id:s.value}))
        });
        reset();
    }
    function handleChangeType(selectedType){
        setSelectedType(selectedType);
    };
    function handleChangeItem(selectedItem){
        setSelectedItem(selectedItem);
    };
    async function handleChangeGroup(selectedGroup){
        setSelectedGroup(selectedGroup);
        const {data} = await axios.get('/item?group._id='+selectedGroup.value);
        setItems(data.map(i=>({value:i._id, label:i.value})));
    };
    async function change(parameter){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const showInput = document.getElementById("show");
        // const valueInput = document.getElementById("value");
        nameInput && (nameInput.value = parameter.name);
        unitInput && (unitInput.value = parameter.unit);
        showInput && (showInput.checked = parameter.show);
        // valueInput && (valueInput.value = parameter.value);
        setSelectedType({value: parameter.type, label: types.find(t=>t.value===parameter.type).label});
        setSelectedGroup(null);
        const {data} = await axios.get('/item');
        setItems(data.map(i=>({value:i._id, label:i.value})));
        setSelectedItem(parameter.available_items.map(i=>({value:i._id, label: i.value})));
        setUpdateId(parameter._id);
    }
    function save(){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const showInput = document.getElementById("show");
        // const valueInput = document.getElementById("value");
        Parameter.update({
            _id: updateId,
            name: nameInput.value,
            type: selectedType.value,
            unit: unitInput?unitInput.value:null,
            show: showInput.checked,
            // value: valueInput?valueInput.value:null,
            available_items: selectedItem?selectedItem.map(s=>({value:s.label, _id:s.value})):null
        })
        reset();
    }
    return(
        <Layout>
            <h4 className='rubic my-4'>
                Параметры
            </h4>
            <div className='mb-3 row bg-white mx-1' style={{border: '2px solid ' + (updateId?'#0bc3e0':'#28a745')}}>
                {updateId && <div className='p-2 w-100' style={{background:'#0bc3e0'}}>Редактирование</div>}
                {!updateId && <div className='p-2 w-100' style={{background:'#28a745', color: 'white'}}>Новый параметр</div>}
                <div className='col-12 my-2'><input type="text" id="name" placeholder='Наименование'/></div>
                <div className='col-12 my-2'><input type="text" id="unit" placeholder='Единица измерения'/></div>
                <div className='col-12 my-2 d-flex' style={{flexWrap:'none'}}>
                    <span>Показывать</span><input type="checkbox" id='show' className='my-1 ml-2'/>
                </div>
                <div className='mb-2 col-md-6'><Select
                    value={selectedType}
                    onChange={handleChangeType}
                    options={types}
                    instanceId="selectType"
                    placeholder='Тип параметра'
                /></div>
                {(selectedType.value!==0) && <>
                <div className='col-md-6 mb-2'><Select
                    value={selectedGroup}
                    onChange={handleChangeGroup}
                    options={groups}
                    instanceId="selectGroup"
                    placeholder='Группа элементов'
                /></div>
                <div className='col-md-6 mb-2'><Select
                    value={selectedItem}
                    onChange={handleChangeItem}
                    options={items}
                    instanceId="selectItem"
                    placeholder='Элементы'
                    isMulti
                /></div></>}
                {!updateId?<p><button className='btn ml-2 btn-success' onClick={create}>Создать</button></p>
                :<div className='col mb-2'>
                    <button className='btn mr-2' onClick={save}>Сохранить</button>
                    <button className='btn' onClick={reset}>Отмена</button>
                </div>}
            </div>
            <div className="table-responsive p-2">
                <table className='table table-light shadow'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Наименование</th>
                            <th>Тип</th>
                            <th>Ед изм</th>
                            <th>Элементы</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                    {parameters.map((parameter, i)=>(
                        <tr key={i+'pa'}>
                            <td>{parameter.name}</td>
                            <td>{types.find(t=>t.value===parameter.type).label}</td>
                            <td>{parameter.unit}</td>
                            <td>{parameter.available_items && parameter.available_items.map(ai=>(
                                    <span className='badge bg-primary p-1 mr-1' style={{color: 'white'}}>{ai.value}</span>
                                ))}</td>
                            <td className='d-flex'><button className='btn mr-2' onClick={()=>{Parameter.remove(parameter._id)}}>Удалить</button>
                            <button className='btn' onClick={()=>change(parameter)}>Изменить</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}