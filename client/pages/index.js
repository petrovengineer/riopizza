import Layout from '../components/layout.js'
import Product from '../components/product.js'
import Slider from '../components/slider.js'
import axios from 'axios';
import {useEffect, useState} from 'react'

export default function Home({products, items}) {
  const [sorted, setSorted] = useState({});
  useEffect(()=>{
      const sorted = {};
      products.map((product)=>{
          const typeParameter = product.parameters.find(p=>(p.name==='Тип'));
          if(typeParameter){
          const extItems = items.filter(i=>typeParameter.items.find(tpi=>tpi._id===i._id))
          console.log("EXT ITEMS ",extItems)
          typeParameter.items.map(item=>(
            !sorted[item._id]?sorted[item._id]={name: item.value, sort: item.sort?+item.sort:999, data: [product]}
            :sorted[item._id].data = [...sorted[item._id].data, product]
          ))
        }
      })
      console.log("SORTED ", sorted)
      setSorted(sorted)
  },[products])
  return (
    <Layout sorted = {sorted}>
      {/* <img src='/images/banner1.png' style={{width:'100%'}}/> */}
      <Slider/>
      <div className={'container main'}>
        {Object.keys(sorted).sort(function(a,b){return sorted[a].sort-sorted[b].sort}).map((_id)=>(
          <div key={_id}>
            <a className="anchor" id={_id} href="#"></a>
            <h5 className='mt-3 group'>
              {sorted[_id].name}
            </h5>          
            <div className='row mt-4'>
              {sorted[_id].data.map((product, i)=><Product key={i+'pr'} product = {product} items={items} />)}
            </div>
          </div>
        ))}
        {/* <div className='row mt-4'>
          {products.map((product, i)=><Product key={i+'pr'} product = {product}/>)}
        </div> */}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  try{
    const {data: products} = await axios.get('/product');
    const {data: items} = await axios.get('/item');
    return {
      props: {
        products, items
      }
    }
  }
  catch(e){
    console.log(e);
    return {props: {}}
  }

}
