import Layout from '../components/layout.js'
import Product from '../components/product.js'
import axios from 'axios';
import {useEffect, useState} from 'react'

export default function Home({products, parameter}) {
  const [sorted, setSorted] = useState({});
  useEffect(()=>{
    if(Array.isArray(products)){
      const sorted = {
        0: {name:'Другое', sort: 999, data: []}
      };
      products.map((product)=>{
        const type = product.parameters.find(p=>(p.name==='Тип'));
        if(type){
          type.items.map(item=>{
            if(!sorted[item._id]){
              sorted[item._id]={name: item.value, sort: item.sort?+item.sort:999, data: [product]}
            }else{
              sorted[item._id].data = [...sorted[item._id].data, product]
            }
          })
        }else{
          sorted[0].data = [...sorted[0].data, product]
        }
      })
      console.log("SORTED ", sorted)
      setSorted(sorted)
    }
  },[])
  return (
    <Layout sorted = {sorted}>
      <img src='/images/banner1.png' style={{width:'100%'}}/>
      <div className={'container main'}>
        {Object.keys(sorted).sort(function(a,b){return sorted[a].sort-sorted[b].sort}).map(_id=>(
          <>
            <a className="anchor" id={_id} href="#"></a>
            <h5 className='mt-3 group'>
              {sorted[_id].name}
            </h5>          
            <div className='row mt-4'>
              {sorted[_id].data.map((product, i)=><Product key={i+'pr'} product = {product}/>)}
            </div>
          </>
        ))}
        {/* <div className='row mt-4'>
          {products.map((product, i)=><Product key={i+'pr'} product = {product}/>)}
        </div> */}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const {data: products} = await axios.get('/product');
  const {data: parameter} = await axios.get('/parameter?_id=605530346336510160aaa186');
  return {
    props: {
      products: Array.isArray(products)?products:[products],
      parameter
    }
  }
}
