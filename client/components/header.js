import { useState } from "react"
import User from './user'

export default function Header(){
    const [show, setShow] = useState(true)
    return (
                <nav className="navbar navbar-expand-md navbar-dark " style={{position:'sticky', top:'0'}}>
                    <div className='container'>
                        <a href="/">
                            <img src="/images/logo2.png" className='mb-2 mt-2' height={50}/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="true" aria-label="Toggle navigation" onClick={()=>{setShow(!show)}}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={"navbar-collapse collapse d-flex justify-content-between flex-column flex-md-row align-items-start "+ (show?'show':'')} id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Пицца</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Соусы</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Напитки</a>
                            </li>
                            </ul>
                            {/* <div class="col-lg-4 col-md-9 col-8"> */}
                                <div class="customer-area">
                                    <span className='mr-3'>
                                        <a href="#"><i class="fas fa-heart"></i></a>
                                    </span>
                                    <span className='mr-3'>
                                        <a href="#"><i class="fas fa-user"></i></a>
                                    </span>
                                    <span className='mr-3'>
                                        <a href="shopping-cart.html"><i class="fas fa-shopping-basket"></i></a>
                                    </span>
                                    {/* <a href="#" class="btn">login</a> */}
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