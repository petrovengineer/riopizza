import { useContext, useEffect } from "react"
import AppContext from '../context'
import Link from "next/link";


export default function User(){
    const context = useContext(AppContext);
    const {user, accessToken, refreshToken} = context;
    function exit(){
        user.clear(context);
        accessToken.clear(context);
        refreshToken.clear(context);
    }
    return(
        <div className='user'>

        {(user && user.value && 
                <>{user.value.name}
                {user.value.admin && <Link href="/admin"><a><i className="fas fa-cog ml-2"></i></a></Link>}
                {user.value.operator && <Link href="/admin/orders"><a><i className="fas fa-coins ml-2"></i></a></Link>}
                <a href="#" onClick={exit}><i className="fas fa-sign-out-alt"></i></a></>
        ) || <Link href='/login'>Вход</Link>}
</div>        
    )
}