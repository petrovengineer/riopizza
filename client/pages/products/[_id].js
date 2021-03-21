import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout';
import AppContext from '../../context'
import Select from 'react-select'

export default function Product({product}){
    const context = useContext(AppContext);
    let {_id, name = 'No name', description = '', parameters = [], img} = product;
    const [globalSelected, setGlobalSelected] = useState({});
    const [affects, setAffects] = useState([]);
    function addToCart(){
      let newCart = [];
      if(context.cart.value){newCart.push(...context.cart.value)}
      newCart.push(product);
      console.log(newCart)
      context.cart.set(context, newCart)
    }
    useEffect(()=>{
      let affectArray = Object.keys(globalSelected).map(index=>(
          Array.isArray(globalSelected[index])?globalSelected[index].filter(f=>!f.selected).map(a=>(a.affect)):
          globalSelected[index].affect
        )).flat(2);
      console.log("GS", affectArray);
      setAffects(affectArray);
    },[globalSelected])
    return(
      <Layout>
          <div className='row'>
            <div className='col-md-6'>
              <img 
                className='float-md-right'
                width="300"
                src={img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'}
              />
            </div>
            <div className='col-md-6'>
              <h2>{name}</h2>
              <p>{description}</p>
              {parameters.map((parameter,i) =>
                <Parameter 
                  key={i+'pa'} 
                  parameter = {parameter} 
                  setGlobalSelected = {setGlobalSelected} 
                  globalSelected = {globalSelected}
                  computed = {parameter.type===0?affects.filter(a=>a.parameter._id===parameter._id).map(a=>(a.value)):0}
                />
              )}
              <button onClick={addToCart}>В корзину</button>
            </div>
          </div>
      </Layout>
  )
}

function Parameter({parameter, setGlobalSelected, globalSelected, computed}){
  var {
      _id,
      name = 'No name', 
      value = null,
      items = [],
      unit = '',
      type = 0,
      selected: selectedItems = false
  } = parameter;
  const [selected, setSelected] = useState((selectedItems && type===1)?[...items.map(i=>({
    value: i._id, label: i.value, affect: i.affect
  }))]:null);
  function onChangeItem(selected){
    setSelected(selected);
    let newGlobalSelected = Object.assign({}, globalSelected);
    let newSelected;
    if(Array.isArray(selected)){
      newSelected = [...selected.map(s=>{
        s.selected = selectedItems;
        return s;
      })]
    }else{
      newSelected = Object.assign({}, selected)
      newSelected.selected = selectedItems;
    }
    newGlobalSelected[_id] = newSelected;
    setGlobalSelected(newGlobalSelected);
  }
  return(
      <div>
          <h5>{name}</h5>
          {
              type===0?
                <>
                  <span>{+value + computed.reduce((acc, cur)=>(+acc + +cur),0)} {unit}</span>
                </>
              :type===1 || type===2?
                <Select
                  value={selected}
                  onChange={onChangeItem}
                  options={items.map(i=>({
                    value: i._id, label: i.value, affect: i.affect
                  }))}
                  instanceId={_id}
                  placeholder={'Выбрать ' + name}
                  isMulti={type===1}
                />
              :''
          }
      </div>
  )
}

export async function getStaticPaths() {
  const {data} = await axios.get('http://localhost:3100/product');
  const products = Array.isArray(data)?data:[data];
  const paths = products.map((product) => ({
    params: {_id: product._id.toString()},
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  let {_id} = params;
  let link = '/product?_id='+_id;
  const {data: products=[]} = await axios.get(link);
  return {
    props: {
      product: products
    }
  }
}