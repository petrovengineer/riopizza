import axios from 'axios'
import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"
import Select from 'react-select';

export default function Items(){
    const [items, setItems] = useState([])
    const [groups, setGroups] = useState([])
    const [parameters, setParameters] = useState()
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [updateId, setUpdateId] = useState(null);
    const Item = new Element('/item', items, setItems);
    useEffect(async ()=>{
        Item.fetch();
        const {data} = await axios.get('/group');
        setGroups(data.map(d=>({value:d._id, label: d.name})));
        const {data:parameters} = await axios.get('/parameter?type=0');
        setParameters(Array.isArray(parameters)?parameters.map(p=>({value:p._id, label:p.name})):
            [{value: parameters._id, label: parameters.name}]
        )
    },[])
    function create(){
        const input = document.getElementById("value");
        Item.create({
            value:input.value, 
            group: selectedGroup? {name: selectedGroup.label, _id:selectedGroup.value}: null});
        input.value = '';
        setSelectedGroup(null);
    }
    function handleChangeGroup(selectedGroup){
        setSelectedGroup(selectedGroup);
    };
    function handleChangeParameter(selectedParameter){
        setSelectedParameter(selectedParameter);
    }
    function change(item){
        const itemInput = document.getElementById('value');
        itemInput.value = item.value;
        item.group && setSelectedGroup({value: item.group._id, label: item.group.name});
        setUpdateId(item._id);
    }
    function reset(){
        const itemInput = document.getElementById('value');
        itemInput.value = '';
        setSelectedGroup(null);
        setUpdateId(null);
        setSelectedParameter(null);
    }
    function save(){
        const itemInput = document.getElementById('value');
        Item.update({
            _id: updateId,
            value: itemInput.value,
            group: {name: selectedGroup.label, _id: selectedGroup.value}
        })
        reset();
    }
    function addAffect(){
        const affectValueInput = document.getElementById('affect_value');
        const item = items.find(i=>i._id===updateId);
        const oldAffect = item.affect?[...item.affect]:[];
        Item.update({
            _id: updateId,
            affect: [...oldAffect, {
                value: affectValueInput.value,
                parameter: {name: selectedParameter.label, _id: selectedParameter.value}
            }],
        })
    }
    function removeAffect(index){
        const item = items.find(i=>i._id===updateId);
        const newAffect = [...item.affect];
        newAffect.splice(index,1)
        Item.update({
            _id: updateId,
            affect: newAffect
        })
    }
    return(
        <Layout>
            <h2>
                Элементы
            </h2>
            <p><input type="text" id="value" placeholder='Новый элемент'/></p>
            <div style={{maxWidth:'300px'}}><Select
                value={selectedGroup}
                onChange={handleChangeGroup}
                options={groups}
                instanceId="selectGroup"
                placeholder='Группа'
            /></div>
            {!updateId?<p><button className='btn' onClick={create}>Создать</button></p>
            :<>
                <div style={{maxWidth:'300px'}}>
                    <Select
                        value={selectedParameter}
                        onChange={handleChangeParameter}
                        options={parameters}
                        instanceId="selectParameter"
                        placeholder='Параметр влияния'
                        style={{width:'300px'}}
                    />
                </div>
                <p>
                    <input type="text" id="affect_value" placeholder='Величина влияния'/>
                </p>
                <p>
                    <button className='btn' onClick={addAffect}>Добавить</button>
                </p>
                <h4>Влияния:</h4>
                <p>
                    {items.find(i=>i._id===updateId) && items.find(i=>i._id===updateId).affect.map((a, i)=>(
                        <span key={i+'aff'} style={{background:'gray', color: 'white', padding:'10px', marginRight:'10px'}}>
                            {a.parameter.name + ' ' + a.value + ' '}
                            <a href="#" onClick={()=>removeAffect(i)}>X</a>
                        </span>
                    ))}
                </p>
                <p>
                    <button className='btn' onClick={save}>Сохранить</button>|
                    <button className='btn' onClick={reset}>Отмена</button>
                </p>
            </>}
            <table className='table'>
                <thead className='thead-dark'>
                    <tr>
                        <th>Название</th>
                        <th>Группа</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item, i)=>(
                    <tr key={i+'it'}>
                        <td>{item.value}</td>
                        <td>{item.group && item.group.name}</td>
                        <td>
                            <button className='btn' onClick={()=>{Item.remove(item._id)}}>Удалить</button>|
                            <button className='btn' onClick={()=>{change(item)}}>Изменить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </Layout>
    )
}