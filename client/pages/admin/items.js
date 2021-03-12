import axios from 'axios'
import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"
import Select from 'react-select';

export default function Admin(){
    const [items, setItems] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null);
    const Item = new Element('/item', items, setItems);
    useEffect(async ()=>{
        Item.fetch();
        const {data} = await axios.get('/group');
        setGroups(data.map(d=>({value:d._id, label: d.name})));
    },[])
    function create(){
        const input = document.getElementById("new");
        Item.create({value:input.value, group: selectedGroup? selectedGroup.label: null});
        input.value = '';
        setSelectedGroup(null);
    }
    function handleChangeGroup(selectedGroup){
        setSelectedGroup(selectedGroup);
        console.log(`Option selected:`, selectedGroup);
    };
    return(
        <Layout>
            <h2>
                Элементы
            </h2>
            <input type="text" id="new" placeholder='Новый элемент'/>
            Группа:
            <Select
                value={selectedGroup}
                onChange={handleChangeGroup}
                options={groups}
                instanceId="selectGroup"
            />
            <button onClick={create}>Создать</button><br/>
            {items.map((item, i)=>(
                <div key={i+'it'}>
                    {item.value} Группа: {item.group}
                    <button onClick={()=>{Item.remove(item._id)}}>Удалить</button>
                </div>
            ))}
        </Layout>
    )
}