import axios from 'axios'
import Select from 'react-select';
import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"

export default function Admin(){
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
        Parameter.fetch();
        const {data: itemData} = await axios.get('/item');
        setItems(itemData.map(i=>({value:i._id, label:i.value})));
        const {data: groupData} = await axios.get('/group');
        setGroups(groupData.map(i=>({value:i._id, label:i.name})));
    },[])
    function create(){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const valueInput = document.getElementById("value");
        Parameter.create({
            name: nameInput.value,
            type: selectedType.value,
            unit: unitInput.value,
            value: valueInput.value,
            available_items: selectedItem.map(s=>({value:s.label, item_id:s.value}))
        });
        setSelectedItem(null);
        nameInput.value = '';
        unitInput.value = '';
        valueInput.value = '';
    }
    function handleChangeType(selectedType){
        setSelectedType(selectedType);
        console.log(`Option selected:`, selectedType);
    };
    function handleChangeItem(selectedItem){
        console.log(selectedItem);
        setSelectedItem(selectedItem);
        console.log(`Option selected:`, selectedItem);
    };
    async function handleChangeGroup(selectedGroup){
        setSelectedGroup(selectedGroup);
        const {data} = await axios.get('/item?group='+selectedGroup.label);
        setItems(data.map(i=>({value:i._id, label:i.value})));
        console.log(`Option selected:`, selectedItem);
    };
    async function change(parameter){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const valueInput = document.getElementById("value");
        nameInput.value = parameter.name;
        unitInput.value = parameter.unit;
        valueInput.value = parameter.value;
        setSelectedGroup(null);
        const {data} = await axios.get('/item');
        setItems(data.map(i=>({value:i._id, label:i.value})));
        setSelectedItem(parameter.available_items.map(i=>({value:i.item_id, label: i.value})));
        setUpdateId(parameter._id);
    }
    function save(){
        const nameInput = document.getElementById("name");
        const unitInput = document.getElementById("unit");
        const valueInput = document.getElementById("value");
        Parameter.update({
            _id: updateId,
            name: nameInput.value,
            type: selectedType.value,
            unit: unitInput.value,
            value: valueInput.value,
            available_items: selectedItem.map(s=>({value:s.label, item_id:s.value}))
        })
    }
    return(
        <Layout>
            <h2>
                Параметры
            </h2>
            <input type="text" id="name" placeholder='Новый элемент'/>
            <Select
                value={selectedType}
                onChange={handleChangeType}
                options={types}
                instanceId="selectType"
            />
            <Select
                value={selectedGroup}
                onChange={handleChangeGroup}
                options={groups}
                instanceId="selectGroup"
            />
            <Select
                value={selectedItem}
                onChange={handleChangeItem}
                options={items}
                instanceId="selectItem"
                isMulti
            />
            <input type="text" id="value" placeholder='Значение:'/>
            <input type="text" id="unit" placeholder='Единица измерения:'/>
            <button onClick={create}>Создать</button><br/>
            <button onClick={save}>Сохранить</button><br/>
            {parameters.map((parameter, i)=>(
                <div key={i+'pa'}>
                    {parameter.name} 
                    {types.find(t=>t.value===parameter.type).label}
                    Значение: {parameter.value}
                    Ед изм: {parameter.unit}
                    Элементы: {parameter.available_items.map(ai=>(ai.value))}
                    <button onClick={()=>{Parameter.remove(parameter._id)}}>Удалить</button>
                    <button onClick={()=>change(parameter)}>Изменить</button>
                </div>
            ))}
        </Layout>
    )
}