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
      console.log("GLOBAL SELECTED ", globalSelected)
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
        <div className='container mt-4 product-page p-4 shadow'>
          <div className='row'>
            <div className='col-12 col-md-6 d-flex justify-content-center d-md-block'>
              <img 
                className=' float-md-right rounded mb-4'
                width="300"
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

export async function getStaticPaths() {
  const {data: products} = await axios.get('http://localhost:3100/api/product');
  const paths = products.map((product) => ({
    params: {_id: product._id.toString()},
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({params}) {
  let {_id} = params;
  const {data: products=[]} = await axios.get('/product?_id='+_id);
  const {data: parameters} = await axios.get('/parameter');
  const {data: items} = await axios.get('/item');
  const newParams = [...products[0].parameters.map(pp=>{
    let x = parameters.find(p=>p._id===pp._id)
    let newPP = Object.assign({}, pp);
    //==========Populate=======
    newPP.type = x.type;
    newPP.show = x.show;
    newPP.unit = x.unit;
    //========================
    newPP.items = pp.items?[...pp.items.map(ppi=>items.find(i=>i._id===ppi._id))]:null;
    return newPP;
  })]
  const newProduct = Object.assign({}, products[0])
  newProduct.parameters = newParams;
  // console.log("NEW PRODUCT", newProduct)
  return {
    props: {
      product: newProduct
    }
  }
}
