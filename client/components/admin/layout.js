import Head from 'next/head'
import Link from 'next/link'
import User from '../user'
// import Image from 'next/image'
export default function Layout({children}){
	return (
		<>
			<Head>
				<title>Панель администратора</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
      		<header>
		        <img
		          src="/images/admin_logo.png"
		          width={100}
		          height={100}
		        />
				<User/>
		        <Link href="/admin/items">Заказы</Link>
		        <Link href="/admin/products">Продукты</Link>
		        <Link href="/admin/parameters">Параметры</Link>
		        <Link href="/admin/items">Элементы</Link>
		        <Link href="/admin/groups">Группы элементов</Link>
		        <Link href="/admin/productgroups">Группы продуктов</Link>
		        <Link href="/admin/users">Пользователи</Link>
		    </header>
		    <main className={'container'}>
					{children}
		    </main>
			<footer>

      		</footer>
		</>
	)
}