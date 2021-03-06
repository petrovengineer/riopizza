import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout';
import Parameter from '../../components/parameter';
import AppContext from '../../context'

export default function Product({product}){
    const context = useContext(AppContext);
    let {_id, name = 'No name', description = '', parameters = [], img} = product;
    const [alert, setAlert] = useState(false);
    const typeZeroGlobal = {}
    const typeZeroParams = parameters.filter(p=>(p.type===0));
    typeZeroParams.map(tz=>{
      typeZeroGlobal[tz.name] = {parameter: tz, value: tz.value};
    })

    const [globalSelected, setGlobalSelected] = useState(typeZeroGlobal);
    const [affects, setAffects] = useState([]);

    useEffect(()=>{
      let affectArray = Object.keys(globalSelected)
        .filter(key=>globalSelected[key].parameter.type!==0 && !globalSelected[key].parameter.selected)
        .map(key=>(
          Array.isArray(globalSelected[key].items)?globalSelected[key].items.map(a=>(a.affect)):globalSelected[key].items.affect)
        )
        .flat(2)
      setAffects(affectArray);
    },[globalSelected])

    function addToCart(){
      let newCart = [];
      if(context.cart.value){newCart.push(...context.cart.value)}
      newCart.push({
        product,
        img: product.img,
        name: product.name,
        parameters: globalSelected,
        affects: affects,
        count: 1
      });
      context.cart.set(context, newCart)
      setAlert(true);
    }

    return(
      <Layout>
        <div className='container mt-4 product-page p-4 shadow bg-white'>
          <div className='row'>
            <div className='col-12 col-md-6 d-flex justify-content-center d-md-block'>
              <img 
                className=' float-md-right rounded mb-4 w-100'
                style={{maxWidth:'300px', maxHeight:'300px'}}
                // width="300"
                src={(img && img.data)?`data:image/jpeg;base64,${img.data}`:'/images/pizza.jpg'}
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
                  computed = {
                    parameter.type===0?affects.filter(
                      a=>{
                        return(a && a.parameter && (a.parameter._id===parameter._id))
                      }).map(a=>(a.value))
                    :0
                  }
                />)
              )}
              {true && <div className={"alert alert-success alert-dismissible fade "+(alert?'show ':'')+(!alert?'hide':'')} role="alert">
                <strong>Продукт добавлен в корзину.</strong>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=>{setAlert(false)}}>
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

export async function getStaticPaths(){
  const {data: products} = await axios.get('http://localhost:3100/api/product');
  const paths = products.map((product) => ({
    params: {_id: product._id.toString()},
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  let {_id} = params;
  const {data: products=[]} = await axios.get('/product?_id='+_id);
  const {data: paramsData} = await axios.get('/parameter');
  const {data: itemsData} = await axios.get('/item');

  const productData = products[0];

  const fullParams = productData.parameters.map(pp=>{
    let fullPP = paramsData.find(p=>p._id===pp._id);
    if(!fullPP){return {_id: pp._id, name: pp.name, deleted: true}}
    let newPP = Object.assign({}, pp);
    //==========Populate=======
    newPP.type = fullPP.type;
    newPP.show = fullPP.show;
    newPP.unit = fullPP.unit;
    //========================
    if(pp.items){
        const fullItems = pp.items.map(ppi=>{
            const fullItem = itemsData.find(i=>i._id===ppi._id);
            if(!fullItem){return {_id:ppi._id, value: ppi.value, deleted: true}}
            const newAffect = [...fullItem.affect.map(a=>({
              value: a.value,
              parameter: paramsData.find(p=>p._id===a.parameter._id) || a.parameter
            }))];
            fullItem.affect = newAffect;
            return fullItem;
          });
          newPP.items = fullItems;
    }
    return newPP;
  });
  const newProduct = Object.assign({}, productData);
  newProduct.parameters = fullParams;

  return {
    props: {
      product: newProduct
    }, revalidate: 60
  }
}
