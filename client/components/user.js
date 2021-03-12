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
        (user && user.value && 
            <div>
                {user.value.name} {user.value.phone}
                {user.value.admin && <Link href="/admin">Панель администратора</Link>}
                <button onClick={exit}>Exit</button>
            </div>
        ) || <Link href='/login'>Login</Link>
        
    )
}