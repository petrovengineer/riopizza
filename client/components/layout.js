import Head from 'next/head'
import Link from 'next/link'
import User from './user'
import Header from './header'
import HeaderTop from './header-top'
import Footer from './footer'
// import Image from 'next/image'
export default function Layout({children}){
	return (
		<>
			<Head>
				<title>RioPizza</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<HeaderTop/>
			<Header/>
      		{/* <header>
				<div  className='container'>
					<div className='row d-flex align-items-center'>
						<div class="col-lg-2 col-md-2 col-sm-2 col-3">
							<div class="logo">
								<a href="/">
									<img src="/images/logo2.png" className='mb-2 mt-2' height={60}/>
								</a>
							</div>
						</div>
					</div>
					<Link href="/cart">Корзина</Link>
					<span>
						<a>
							<i className='fas fa-heart'>
							</i>
						</a>
					</span>
					<User/>
				</div>
		    </header> */}
					{children}
		    
			<Footer/>
		</>
	)
}