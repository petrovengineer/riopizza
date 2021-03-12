import axios from 'axios';
import { useContext, useEffect } from 'react';
import Layout from '../../components/layout';
import AppContext from '../../context'

export default function Product({product}){
    const context = useContext(AppContext);
    let {_id, name = 'No name', description = '', extParameters = [], img} = product;
    function addToCart(){
      let newCart = [];
      if(context.cart.value){newCart.push(...context.cart.value)}
      newCart.push(product);
      console.log(newCart)
      context.cart.set(context, newCart)
    }
    return(
      <Layout>
          {/* CONTEXT LENGTH {context.cart?context.cart.value? context.cart.value.length:''} */}
          <img src={img?img:'/images/pizza.jpg'} style={{maxWidth: '30%'}}/>
          <h2>{name}</h2>
          <p>{description}</p>
          {extParameters.map((parameter,i) =><Parameter key={i+'pa'} parameter = {parameter}/>)}
          <button onClick={addToCart}>В корзину</button>
      </Layout>
  )
}

export async function getStaticPaths() {
  const {data: products} = await axios.get('http://localhost:3100/product');
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
      product: products[0]
    }
  }
}

function Parameter({parameter}){
  let {
          name = 'No name', 
          value = null,
          extAvailableItems = [],
          unit = '',
          type = 0 
      } = parameter;
  return(
      <div>
          {name}<br/>
          {
              type===0?<ValueType value = {value} unit = {unit}/>:
              type===1?<CheckableType extAvailableItems = {extAvailableItems}/>:
              type===2?<SelectType extAvailableItems = {extAvailableItems}/>:''
          }
      </div>
  )
}

function ValueType({value, unit}){
  return(
      <h3>{value} {unit}</h3>
  )
}

function CheckableType({extAvailableItems}){
  return(
      <div>
          {extAvailableItems.map((item, i)=><Checkbox key={i+"ch"} name={item.value} value={item._id}/>)}
      </div>
  )
}

function SelectType({extAvailableItems}){
  return(
      <div>
          {extAvailableItems.map((item, i)=><Radio key={i+"ra"} name={item.value} value={item._id}/>)}
      </div>
  )
}

function Checkbox({name, value}){
  return(
      <><input type="checkbox" name={name} value={value}/>{name}</>
  )
}

function Radio({name, value}){
  return(
      <><input type="radio" name={name} value={value}/>{name}</>
  )
}