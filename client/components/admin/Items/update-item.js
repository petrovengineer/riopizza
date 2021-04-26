import { useEffect, useState } from 'react';
import {Affects} from '../Affects';
import Modal from '../../modal';
import Select from 'react-select';

export default function UpdateItem({
        closeModal, 
        modalAffect, setModalAffect,
        selectedParameter, handleChangeParameter, parameters, 
        addAffect, 
        affects, setAffects,
        save, reset, 
        selectedGroup, handleChangeGroup, setSelectedGroup,
        groups, item}) {
    useEffect(()=>{
        const itemInput = document.getElementById('value');
        const itemInputSort = document.getElementById('sort');
        itemInput.value = item.value;
        itemInputSort.value = item.sort?item.sort:0;
        item.group && setSelectedGroup({value: item.group._id, label: item.group.name});
    }, [])
    return (
        <Modal close={closeModal}>
            <span>Изменение элемента</span>
            <div>
                <div className='col-12'>
                    <input type="text" id="value" placeholder='Новый элемент'/>
                </div>
                <div className='col-12 mt-2'><input type="text" id="sort" placeholder='Место в списке'/></div>
                <div className='col-12 col-md-6 mt-2'>
                    <Select
                        value={selectedGroup}
                        onChange={handleChangeGroup}
                        options={groups}
                        instanceId="selectGroup"
                        placeholder='Группа'
                    />
                </div>
                <h5 className='col-12 mt-4 mb-2 pl-0'>Влияния:</h5>
                <button className='btn mb-2' onClick={()=>setModalAffect(true)}>Добавить</button>
                {modalAffect && <Modal close={()=>setModalAffect(false)}>
                    <span>Новый параметр влияния</span>
                    <div>
                        <Select
                            value={selectedParameter}
                            onChange={handleChangeParameter}
                            options={parameters}
                            instanceId="selectParameter"
                            placeholder='Параметр влияния'
                            style={{width:'300px'}}
                        />
                        <input type="text" id="affect_value" className='w-100 p-2 mt-2' placeholder='Величина влияния'/>
                    </div>
                    <div>
                        <button className='btn' onClick={addAffect}>Добавить</button>
                    </div>
                </Modal>}
                <Affects cards={affects} setCards={setAffects}/>
                {/* <Affects affect={items.find(i=>i._id===updateId).affect}/> */}
                {/* <div className='col'>
                    {items.find(i=>i._id===updateId) && items.find(i=>i._id===updateId).affect.map((a, i)=>(
                        <span key={i+'aff'} className='badge bg-primary white p-2 mr-1'>
                            {a.parameter.name + ' ' + a.value + ' '}
                            <a href="#" onClick={()=>removeAffect(i)}>X</a>
                        </span>
                    ))}
                </div> */}
            </div>
            <div>
                <button className='btn mr-2' onClick={save}>Сохранить</button>
                <button className='btn' onClick={closeModal}>Отмена</button>
            </div>
        </Modal>
    )
}