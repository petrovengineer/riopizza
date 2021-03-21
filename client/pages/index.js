import Layout from '../components/layout.js'
import Product from '../components/product.js'
import axios from 'axios';

export default function Home({products}) {
  return (
    <Layout>
      {/* <img src='/images/banner1.png' style={{width:'100%'}}/> */}
      <main className={'container'}>
        <div className='row mt-4'>
          {products.map((product, i)=><Product key={i+'pr'} product = {product}/>)}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps() {
  const {data: products} = await axios.get('/product');
  console.log("PRODUCTSSSSSSSSSS", products)
  return {
    props: {
      products: Array.isArray(products)?products:[products]
    }
  }
}
