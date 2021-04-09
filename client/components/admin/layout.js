import Head from 'next/head'
import Link from 'next/link'
import User from '../user'
import {useState} from 'react'
import { useRouter } from 'next/router'

export default function Layout({children}){
    const [show, setShow] = useState(false)
	const router = useRouter();
	const prefix = '/admin'
	return (
		<>
			<Head>
				<title>Панель администратора</title>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<nav className="navbar navbar-expand-md bg-dark " style={{position:'sticky', top:'0', color: 'white'}}>
				<div className='container'>
					<a href="/">
						<img src="/images/admin_logo.png" className='mb-2 mt-2 mr-4' height={50}/>
					</a>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="true" aria-label="Toggle navigation" onClick={()=>{setShow(!show)}}>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className={(show?'d-flex ':'d-none ') + "navbar-collapse collapse justify-content-between flex-column flex-md-row align-items-start "} id="navbarCollapse">
						<ul className="navbar-nav me-auto mb-2 mb-md-0">
							{/* <li><Link href="/admin/items">Заказы</Link></li> */}
							<li>
								<Link href="/admin/products">
									<span className={'link p-2 rounded '+(router.pathname===prefix+'/products'?'bg-primary':'')}>
										Продукты
									</span>
								</Link>
							</li>
							<li>
								<Link href="/admin/parameters">
									<span className={'link p-2 rounded '+(router.pathname===prefix+'/parameters'?'bg-primary':'')}>
										Параметры
									</span>
								</Link>
							</li>
							<li>
								<Link href="/admin/items">
									<span className={'link p-2 rounded '+(router.pathname===prefix+'/items'?'bg-primary':'')}>
										Элементы
									</span>
								</Link>
							</li>
							<li>
								<Link href="/admin/groups">
									<span className={'link p-2 rounded '+(router.pathname===prefix+'/groups'?'bg-primary':'')}>
										Группы элементов
									</span>
								</Link>
							</li>
						</ul>
						<User/>
					</div>
				</div>
			</nav>
	    	<main className={'container'}>
					{children}
		    </main>
		</>
	)
}