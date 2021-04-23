import Select from 'react-select'
import { useContext, useEffect, useState } from 'react';

export default function Parameter({parameter, setGlobalSelected, globalSelected, computed}){
    var {
        _id,
        name = 'No name', 
        value = null,
        items = [],
        unit = '',
        type = 0,
        selected: selectedItems = false
    } = parameter;
    
    const [selected, setSelected] = useState((selectedItems && type===1)?[...items.map(i=>({value: i._id, label: i.value}))]:null);
    console.log("PARAMETER", parameter)

    function onChangeItem(selected){
      setSelected(selected);
      let newGlobalSelected = Object.assign({}, globalSelected);
      let newSelected;
      console.log("ITEMS", items)
      if(Array.isArray(selected)){
        if(selectedItems){
          newSelected = {parameter, items: [...items.filter(i=>{
              return selected.find(s=>s.value===i._id)?false:true; //ИСКЛЮЧИТЬ
            })]}
        }
        else{
          newSelected = {parameter, items: [...items.filter(i=>{
            return selected.find(s=>s.value===i._id)?true:false; 
          })]}
        }
      }else{
        newSelected = {parameter, items: items.find(i=>i._id===selected.value)}
      }
      newGlobalSelected[name] = newSelected;
      setGlobalSelected(newGlobalSelected);
    }

    return(
        <div className='row'>
            <div className={(type===0 ?'col-2 ':'') + 'col-md-4'}><span className='mr-2'>{name}</span></div>
            {
                type===0?
                  <>
                    <div className='col-10 col-md-8 mb-4'><span className='ml-2'>{+value + computed.reduce((acc, cur)=>(+acc + +cur),0)} {unit}</span></div>
                  </>
                :type===1 || type===2?
                  <div className='col-md-8 mb-4'>
                    <Select
                      value={selected}
                      onChange={onChangeItem}
                      options={items.map(i=>({
                        value: i._id, label: i.value+' ' + unit + ' ' + 
                        ((i.affect && Array.isArray(i.affect))?i.affect.map(a=>(
                           ' +'+ a.value+' '+a.parameter.unit
                          )):''), 
                        affect: i.affect
                      }))}
                      instanceId={_id}
                      placeholder={name}
                      isMulti={type===1}
                      blurInputOnSelect
                      captureMenuScroll
                    />
                  </div>
                :''
            }
        </div>
    )
  }