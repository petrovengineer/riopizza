import Head from 'next/head'
// import Link from 'next/link'
import AppContext from '../context'
import { useContext, useEffect } from 'react'
import Layout from '../components/layout';
export default function Basket(){
	const context = useContext(AppContext);
	let {cart:{value:cart=[]}} = context;
	return(
		<Layout>
			<Head>
				<title>Корзина</title>
			</Head>
			<h2>
				Корзина
			</h2>
			{cart.map((item)=>(
				item.name
			))}
		</Layout>
)}