import { useState } from "react"
import User from './user'

export default function Header({sorted={}}){
    const [show, setShow] = useState(true)
    return (
                <nav className="navbar navbar-expand-md navbar-dark " style={{position:'sticky', top:'0'}}>
                    <div className='container'>
                        <a href="/">
                            <img src="/images/logo2.png" className='mb-2 mt-2 mr-4' height={50}/>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="true" aria-label="Toggle navigation" onClick={()=>{setShow(!show)}}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={"navbar-collapse collapse d-flex justify-content-between flex-column flex-md-row align-items-start "+ (show?'show':'')} id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                {Object.keys(sorted).sort(function(a,b){return sorted[a].sort-sorted[b].sort}).map(_id=>(
                                    <li className="nav-item" key={_id}>
                                        <a className="nav-link active" aria-current="page" href={`#${_id}`}>{sorted[_id].name}</a>
                                    </li>
                                ))}
                                {Object.keys(sorted).length===0 &&
                                    <li className="nav-item" key={'main'}>
                                        <a className="nav-link active" aria-current="page" href='/'>На главную</a>
                                    </li>
                                }
                            </ul>
                                <div class="customer-area">
                                    <a href="#" className='p-0'>
                                        <span className='mr-3'>
                                            <i class="fas fa-heart"></i>
                                        </span>
                                    </a>
                                    <a href="#" className='p-0'>
                                        <span className='mr-3'>
                                            <i class="fas fa-user"></i>
                                        </span>
                                    </a>
                                    <a href="/cart" className='p-0'>
                                        <span className='mr-3'>
                                            <i class="fas fa-shopping-basket"></i>
                                        </span>
                                    </a>
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