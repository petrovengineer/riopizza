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
        const {data} = await axios.get(process.env.NEXT_PUBLIC_API+'/group');
        setGroups(data.map(d=>({value:d._id, label: d.name})));
        const {data:parameters} = await axios.get(process.env.NEXT_PUBLIC_API+'/parameter?type=0');
        setParameters(Array.isArray(parameters)?parameters.map(p=>({value:p._id, label:p.name})):
            [{value: parameters._id, label: parameters.name}]
        )
    },[])
    function create(){
        const input = document.getElementById("value");
        const inputSort = document.getElementById("sort");
        Item.create({
            value:input.value, 
            sort:inputSort.value, 
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
        const itemInputSort = document.getElementById('sort');
        itemInput.value = item.value;
        itemInputSort.value = item.sort?item.sort:0;
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
        const itemInputSort = document.getElementById('sort');
        Item.update({
            _id: updateId,
            value: itemInput.value,
            sort: itemInputSort.value || 999,
            group: {name: selectedGroup.label, _id: selectedGroup.value}
        })
        reset();
    }
    function addAffect(){
        var r = /\d+/;
        const affectValueInput = document.getElementById('affect_value');
        const item = items.find(i=>i._id===updateId);
        const oldAffect = item.affect?[...item.affect]:[];
        Item.update({
            _id: updateId,
            affect: [...oldAffect, {
                value: +affectValueInput.value.match(r),
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
            <h4 className='my-4 rubic'>
                Элементы
            </h4>
            <div className='row bg-white p-4 shadow mb-4'>
                <div className='col-12'><input type="text" id="value" placeholder='Новый элемент'/></div>
                <div className='col-12 mt-2'><input type="text" id="sort" placeholder='Место в списке'/></div>
                <div className='col-12 col-md-6 mt-2'><Select
                    value={selectedGroup}
                    onChange={handleChangeGroup}
                    options={groups}
                    instanceId="selectGroup"
                    placeholder='Группа'
                /></div>
                {!updateId?<div className='col-12 col-md-6 mt-2'><button className='btn btn-success' onClick={create}>Создать</button></div>
                :<>
                    <div className='col-12'></div>
                    <div className='col-12 col-md-6 mt-2'>
                        <Select
                            value={selectedParameter}
                            onChange={handleChangeParameter}
                            options={parameters}
                            instanceId="selectParameter"
                            placeholder='Параметр влияния'
                            style={{width:'300px'}}
                        />
                    </div>
                    <div className='col-12'></div>
                    <div className='col-12 col-md-6 my-2'>
                        <input type="text" id="affect_value" className='w-100 p-2' placeholder='Величина влияния'/>
                    </div>
                    <div className='col-12'>
                        <button className='btn' onClick={addAffect}>Добавить</button>
                    </div>
                    <h5 className='col-12 mt-4 mb-2'>Влияния:</h5>
                    <div className='col'>
                        {items.find(i=>i._id===updateId) && items.find(i=>i._id===updateId).affect.map((a, i)=>(
                            <span key={i+'aff'} className='badge bg-primary white p-2 mr-1'>
                                {a.parameter.name + ' ' + a.value + ' '}
                                <a href="#" onClick={()=>removeAffect(i)}>X</a>
                            </span>
                        ))}
                    </div>
                    <div className='col-12 mt-4 d-flex'>
                        <button className='btn mr-2' onClick={save}>Сохранить</button>
                        <button className='btn' onClick={reset}>Отмена</button>
                    </div>
                </>}
            </div>
            <div className="table-responsive p-2">
                <table className='table bg-white shadow'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Название</th>
                            <th>Место в списке</th>
                            <th>Группа</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, i)=>(
                        <tr key={i+'it'}>
                            <td>{item.value}</td>
                            <td>{item.sort}</td>
                            <td>{item.group && item.group.name}</td>
                            <td className='d-flex'>
                                <button className='btn mr-2' onClick={()=>{Item.remove(item._id)}}>Удалить</button>
                                <button className='btn' onClick={()=>{change(item)}}>Изменить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}
