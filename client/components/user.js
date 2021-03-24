import { useContext, useEffect } from "react"
import AppContext from '../context'
import Link from "next/link";


export default function User(){
    const context = useContext(AppContext);
    const {user, accessToken, refreshToken} = context;
    function exit(){
        user.set(context, null);
        accessToken.set(context, null);
        refreshToken.set(context, null);
    }
    return(
        <div className='user'>

        {(user && user.value && 
                <>{user.value.name}
                {user.value.admin && <Link href="/admin"><a><i class="fas fa-cog ml-2"></i></a></Link>}
                <a href="#" onClick={exit}><i class="fas fa-sign-out-alt"></i></a></>
        ) || <Link href='/login'>Вход</Link>}
</div>        
    )
}