import axios from 'axios'
import { useEffect, useState } from "react";
import {Element} from "../../../mylib"
import Panel from '../panel';
import ListItems from './list-items'
import NewItem from './new-item'
import UpdateItem from './update-item';

export default function Items(){
    const [items, setItems] = useState([])
    const [groups, setGroups] = useState([])
    const [parameters, setParameters] = useState()
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedParameter, setSelectedParameter] = useState(null);
    const [updateItem, setUpdateItem] = useState(null);
    const Item = new Element('/item', items, setItems);
    const [modal, setModal] = useState([]);
    const [modalAffect, setModalAffect] = useState(false);
    const [affects, setAffects] = useState([]);

    useEffect(async ()=>{
        Item.fetch();
        const {data} = await axios.get(process.env.NEXT_PUBLIC_API+'/group');
        setGroups(data.map(d=>({value:d._id, label: d.name})));
        const {data:parameters} = await axios.get(process.env.NEXT_PUBLIC_API+'/parameter?type=0');
        setParameters(Array.isArray(parameters)?parameters.map(p=>({value:p._id, label:p.name})):
            [{value: parameters._id, label: parameters.name}]
        )
    },[])

    useEffect(()=>{
        setAffects(updateItem && updateItem.affect || []);
    }, [updateItem])

    return(
        <>
            <Panel>
                <button className='btn btn-success' onClick={()=>openModal('new')}>Новый элемент</button>
            </Panel>
            {modal.indexOf('new')>=0 && 
                <NewItem closeModal={()=>closeModal('new')} selectedGroup={selectedGroup} handleChangeGroup={handleChangeGroup} groups={groups} create={create}/>
            }
            {updateItem && 
                <UpdateItem 
                    closeModal={()=>setUpdateItem(null)} 
                    selectedGroup={selectedGroup} handleChangeGroup={handleChangeGroup} groups={groups}
                    selectedParameter = {selectedParameter} 
                    handleChangeParameter = {handleChangeParameter}
                    parameters = {parameters}
                    addAffect = {addAffect}
                    affects = {affects}
                    setAffects = {setAffects}
                    save = {save}
                    reset = {reset}
                    item = {updateItem}
                    setSelectedGroup = {setSelectedGroup}
                    modalAffect = {modalAffect} setModalAffect = {setModalAffect}
                />
            }
            <ListItems items={items} removeItem={removeItem} change={change}/>
        </>
    )

    function create(){
        const input = document.getElementById("value");
        const inputSort = document.getElementById("sort");
        Item.create({
            value:input.value, 
            sort:inputSort.value, 
            group: selectedGroup? {name: selectedGroup.label, _id:selectedGroup.value}: null});
        input.value = '';
        closeModal('new')
        setSelectedGroup(null);
    }

    function handleChangeGroup(selectedGroup){
        setSelectedGroup(selectedGroup);
    }

    function handleChangeParameter(selectedParameter){
        setSelectedParameter(selectedParameter);
    }

    function change(item){
        setUpdateItem(item);
        // openModal('update');
    }

    function reset(){
        const itemInput = document.getElementById('value');
        itemInput.value = '';
        setSelectedGroup(null);
        setUpdateItem(null);
        setSelectedParameter(null);
    }
    function save(){
        const itemInput = document.getElementById('value');
        const itemInputSort = document.getElementById('sort');
        Item.update({
            _id: updateItem._id,
            value: itemInput.value,
            sort: itemInputSort.value || 999,
            group: {name: selectedGroup.label, _id: selectedGroup.value},
            affect: affects.map(a=>{
                const newA = Object.assign({}, a);
                if(newA._id.length<24)delete newA._id;
                console.log("NEWA ", newA)
                return newA;
            })
        })
        reset();
    }
    function addAffect(){
        if(selectedParameter){
            var r = /\d+/;
            const affectValueInput = document.getElementById('affect_value');
            const newAffect = updateItem.affect?[...updateItem.affect]:[];
            newAffect.push({
                _id: '123',
                value: affectValueInput.value, 
                parameter:{_id: selectedParameter.value, name: selectedParameter.label}});
            const newUpdateItem = Object.assign({}, updateItem);
            newUpdateItem.affect = newAffect;
            setUpdateItem(newUpdateItem);
            setModalAffect(false);
            // setItems(newItems);
            // Item.update({
            //     _id: updateId,
            //     affect: [...oldAffect, {
            //         value: +affectValueInput.value.match(r),
            //         parameter: {name: selectedParameter.label, _id: selectedParameter.value}
            //     }],
            // })
        }
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
    function removeItem(_id){
        Item.remove(_id);
    }
    function closeModal(which){
        const newModal = [...modal]; 
        newModal.splice(modal.indexOf(which),1); 
        setModal(newModal);
    }
    function openModal(which){
        modal.indexOf(which)<0?setModal([...modal, which]):null
    }
}
