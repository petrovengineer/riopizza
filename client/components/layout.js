import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/layout.module.scss'
export default function Layout({children}){
	return (
		<div>
			<Head>
				<title>RioPizza</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
      		<header>
		        <Image
		          src="/images/logo.png"
		          width={130}
		          height={60}
		        />
		        <Link href="/basket">Корзина</Link>
		    </header>
		    <main className={styles.main}>
				{children}
		    </main>
			<footer>

      		</footer>
		</div>
	)
}