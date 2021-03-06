import Link from "next/link"
import {useState, useContext} from "react"
import User from './user'
import AppContext from '../context'

export default function Header({sorted={}}){
    const [show, setShow] = useState(false)
    const context = useContext(AppContext);
    const {favorite, cart} = context;
    return (
                <nav className="navbar navbar-expand-md navbar-dark pl-4 pl-md-0" style={{position:'sticky', top:'0'}}>
                    <div className='container'>
                        <a href="/">
                            <img src="/images/logo2.png" className='mb-2 mt-2 mr-4' height={50}/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="true" aria-label="Toggle navigation" onClick={()=>{setShow(!show)}}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={(show?'d-flex ':'d-none ')+"navbar-collapse collapse justify-content-between flex-column flex-md-row align-items-start "} id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0 mt-4 mt-md-0">
                                {Object.keys(sorted).sort(function(a,b){return sorted[a].sort-sorted[b].sort}).map(_id=>(
                                    <li className="nav-item" key={_id}>
                                        <a className="nav-link active" onClick={()=>{setShow(false)}} aria-current="page" href={`#${_id}`}>{sorted[_id].name}</a>
                                    </li>
                                ))}
                                {Object.keys(sorted).length===0 &&
                                    <li className="nav-item" key={'main'}>
                                        <a className="nav-link active" aria-current="page" href='/'>На главную</a>
                                    </li>
                                }
                            </ul>
                            <div className="customer-area mb-4 mb-md-0 mt-4 mt-md-0">
                                <Link href='/favorite'>
                                    <a className='p-0 position-relative'>
                                        <span className='mr-3'>
                                            <i className="fas fa-heart"></i>
                                        </span>
                                        {favorite && favorite.value && favorite.value.length>0 && <div className='header-count'>{favorite.value.length}</div>}
                                    </a>
                                </Link>
                                <a href="/cart" className='p-0 position-relative'>
                                    <span className='mr-3'>
                                        <i className="fas fa-shopping-basket"></i>
                                    </span>
                                    {cart && cart.value && cart.value.length>0 && <div className='header-count'>{cart.value.length}</div>}
                                </a>
                                <a href="/orders" className='p-0'>
                                    <span className='mr-3'>
                                        <i className="fas fa-user"></i>
                                    </span>
                                </a>
                                {/* <a href="#" className="btn">login</a> */}
                                <User/>
                            </div>
                            {/* </div> */}
                            {/* <form className="d-flex">
                                <input className="form-control mr-2" type="search" placeholder="Search" aria-label="Search"/>
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form> */}
                        </div>
                    </div>
                </nav>
    )
}