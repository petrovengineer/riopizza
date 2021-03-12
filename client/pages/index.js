import Layout from '../components/layout.js'
import Product from '../components/product.js'
import axios from 'axios';

export default function Home({products}) {
  return (
    <Layout>
      <div className='row'>
        {products.map((product, i)=><Product key={i+'pr'} product = {product}/>)}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const products = await axios.get('/product');
  return {
    props: {
      products: products.data
    }
  }
}
