import Layout from '../components/layout.js'
import axios from 'axios';

export default function Home({products}) {
  return (
    <Layout>
      {products.map(p=>p.name)}
    </Layout>
  )
}

export async function getStaticProps() {
  const products = await axios.get('/product');
  console.log("PRODUCTS", products.data)
  return {
    props: {
      products: products.data
    }
  }
}
