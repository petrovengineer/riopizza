import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout';
import AppContext from '../../context'
import Select from 'react-select'

export default function Product({product}){
    const context = useContext(AppContext);
    let {_id, name = 'No name', description = '', parameters = [], img} = product;
    const [alert, setAlert] = useState(false);
    const typeZeroGlobal = {}
    const typeZeroParams = parameters.filter(p=>(p.type===0));
    typeZeroParams.map(tz=>{
      typeZeroGlobal[tz.name] = {value: tz._id, label: tz.value, affect:[], type: tz.type}
    })

    const [globalSelected, setGlobalSelected] = useState(typeZeroGlobal);
    const [affects, setAffects] = useState([]);

    function addToCart(){
      let newCart = [];
      if(context.cart.value){newCart.push(...context.cart.value)}
      console.log("CONTEXT ", context.cart.value)
      newCart.push({
        product,
        img: product.img,
        name: product.name,
        parameters: globalSelected,
        affects: affects,
        count: 1
      });
      console.log("NEW CART", newCart)
      context.cart.set(context, newCart)
      setAlert(true);
    }

    useEffect(()=>{
      let affectArray = Object.keys(globalSelected).map(index=>(
          Array.isArray(globalSelected[index])?globalSelected[index].filter(f=>!f.selected).map(a=>(a.affect)):
          globalSelected[index].affect
        )).flat(2);
      setAffects(affectArray);
      // console.log("PRODUCT ", product)
      console.log("GLOBAL ", globalSelected)
      // console.log("AFFECT ", affects)
    },[globalSelected])
    return(
      <Layout>
        <div className='container mt-4 product-page p-4 shadow'>
          <div className='row'>
            <div className='col-12 col-md-6 d-flex justify-content-center d-md-block'>
              <img 
                className=' float-md-right rounded mb-4'
                width="300"
                src={img.data?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'}
              />
            </div>
            <div className='col-md-6'>
              <h2 className='mb-4'>{name}</h2>
              <p className='mb-4'>{description}</p>
              {parameters.map((parameter,i) =>
                (parameter.show && <Parameter 
                  key={i+'pa'} 
                  parameter = {parameter} 
                  setGlobalSelected = {setGlobalSelected} 
                  globalSelected = {globalSelected}
                  computed = {parameter.type===0?affects.filter(a=>{console.log("AFFECT",affects); return(a.parameter._id===parameter._id)}).map(a=>(a.value)):0}
                />)
              )}
              {true && <div class={"alert alert-success alert-dismissible fade "+(alert?'show ':'')+(!alert?'hide':'')} role="alert">
                <strong>Продукт добавлен в корзину.</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={()=>{setAlert(false)}}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>}
              {!alert && <button onClick={addToCart} className='btn btn-danger mt-2'>В корзину</button>}
            </div>
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
    // if(Array.isArray(selected)){
    //   newSelected = [...selected.map(s=>{
    //     s.selected = selectedItems;
    //     return s;
    //   })]
    if(Array.isArray(selected)){
      if(selectedItems){
        // const fullItems = [...items.map(i=>({
        //   value: i._id, label: i.value, affect: i.affect
        // }))]
        newSelected = [...items.filter(i=>{
          // i.selected = selectedItems;
          return selected.find(s=>s.value===i._id)?false:true;
        }).map(i=>({value: i._id, label: i.value, affect: i.affect, selected: selectedItems, type}))]
      }
      else{
        newSelected = [...selected.map(s=>{
          s.selected = selectedItems;
          s.type = type;
          return s;
        })]
      }
    }else{
      newSelected = Object.assign({parameterName:name}, selected)
      newSelected.selected = selectedItems;
      newSelected.type = type;
    }
    console.log("NEW SELECTED", newSelected);
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
                      value: i._id, label: i.value+' '+unit, affect: i.affect
                    }))}
                    instanceId={_id}
                    placeholder={'Выбрать ' + name}
                    isMulti={type===1}
                  />
                </div>
              :''
          }
      </div>
  )
}

export async function getStaticPaths() {
  const {data} = await axios.get('http://localhost:3100/api/product');
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
