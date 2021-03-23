import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"

export default function Groups(){
    const [groups, setGroups] = useState([])
    const Group = new Element('/productgroup', groups, setGroups);
    useEffect(async ()=>{
        Group.fetch();
    },[])
    function create(){
        const input = document.getElementById("name");
        Group.create({name:input.value});
        input.value = '';
    }
    return(
        <Layout>
            <h2>
                Группы продуктов
            </h2>
            <input type="text" id="name" placeholder='Новая группа'/>
            <button onClick={create}>Создать</button><br/>
            {groups.map((group, i)=>(
                <div key={i+'it'}>
                    {group.name} 
                    <button onClick={()=>{Group.remove(group._id)}}>Удалить</button>
                </div>
            ))}
        </Layout>
    )
}