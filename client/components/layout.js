import Head from 'next/head'
import Link from 'next/link'
import User from './user'
// import Image from 'next/image'
export default function Layout({children}){
	return (
		<div>
			<Head>
				<title>RioPizza</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
      		<header>
		        <img
		          src="/images/logo.png"
		          width={130}
		          height={60}
		        />
		        <Link href="/cart">Корзина</Link>
				<User/>
		    </header>
		    <main className={'container'}>
					{children}
		    </main>
			<footer>

      		</footer>
		</div>
	)
}