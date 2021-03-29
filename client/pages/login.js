import axios from 'axios'
import AppContext from '../context'
import {useState, useContext} from 'react'
import Layout from '../components/layout'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function Login(){
    const router = useRouter();
    const [phone, changePhone] = useState('');
    const [password, changePassword] = useState('');
    const context = useContext(AppContext);
    const handlePhone = (e)=>{
        changePhone(e.currentTarget.value);
    }
    const handlePassword = (e)=>{
        changePassword(e.currentTarget.value);
    }
    const login = async ()=>{
        try{
            let re = /\+(\b7\d{10}\b)/;
            var valid = re.test(phone);
            if(!valid){
                alert('Неверный формат телефона!');
                return;
            }
            const res = await axios.post(process.env.NEXT_PUBLIC_API+'/auth/login', {phone, password});
            if(res.data.accessToken!=null && res.data.refreshToken!=null){
                context.accessToken.set(context, res.data.accessToken);
                context.refreshToken.set(context, res.data.refreshToken);
                context.user.set(context, res.data.user);
                router.push('/');
            }
        } catch(err){
            console.log(err)
            alert('Ошибка авторизации!');
        }
    }
    return (
        // <Layout>
            <div className="form-signin mt-4 shadow">
                <Link href="/">
                    <a href="#">
                        <img className="mb-4" src="/images/logo.png" alt="" height="72"/>
                    </a>
                </Link>
                <h1 className="h3 mb-3 font-weight-normal">Авторизация</h1>
                <label htmlFor="inputEmail" className="sr-only">Номер телефона</label>
                <input type="text" id="phone" onChange={handlePhone} value={phone} className="form-control mb-2" placeholder="Номер телефона" required="" autoFocus=""/>
                <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                <input type="password" id="password" onChange={handlePassword} value={password} className="form-control" placeholder="Пароль" required=""/>
                <div className="checkbox mb-3">
                    <label>
                    <input type="checkbox" value="remember-me"/> Запомнить меня
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" onClick={login}>Войти</button>
                <Link href='/reg'>
                    <div className='pt-2'>
                        <a href='#' >Регистрация</a>
                    </div>
                </Link>
                <p className="mt-5 mb-3 text-muted">© 2021</p>
            </div>
        // </Layout>
    )
}