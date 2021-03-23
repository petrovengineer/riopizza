import Head from 'next/head'
import Link from 'next/link'
import User from './user'
import Header from './header'
import HeaderTop from './header-top'
import Footer from './footer'
// import Image from 'next/image'
export default function Layout({children, sorted}){
	return (
		<>
			<Head>
				<title>RioPizza</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<div className='wrap'>
				<HeaderTop/>
				<Header sorted = {sorted}/>
				{children}
			</div>
			<Footer/>
		</>
	)
}