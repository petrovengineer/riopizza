import { useEffect, useState } from "react";
import Layout from "../../components/admin/layout";
import {Element} from "../../mylib"

export default function Groups(){
    const [groups, setGroups] = useState([])
    const Group = new Element('/group', groups, setGroups);
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
            <h4 className='rubic my-4'>
                Группы элементов
            </h4>
            <div className='row bg-white shadow p-4'>
                <div className='col-12'><input type="text" id="name" placeholder='Новая группа'/></div>
                <div className='col-12'><button className='btn btn-success mt-2' onClick={create}>Создать</button></div>
            </div>
            <div className="table-responsive p-2">
                <table className='table bg-white shadow'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Название</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                    {groups.map((group, i)=>(
                        <tr key={i+'it'}>
                            <td>{group.name} </td>
                            <td><button className='btn' onClick={()=>{Group.remove(group._id)}}>Удалить</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    )
}