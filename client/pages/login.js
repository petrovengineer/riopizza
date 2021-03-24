import axios from 'axios'
import AppContext from '../context'
import {useState, useContext} from 'react'
import Layout from '../components/layout'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function Login(){
    const router = useRouter();
    const [phone, changePhone] = useState('+79500424342');
    const [password, changePassword] = useState('1212');
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
            const res = await axios.post('/auth/login', {phone, password});
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
            <div class="form-signin mt-4 shadow">
                <Link href="/">
                    <a href="#">
                        <img class="mb-4" src="/images/logo.png" alt="" height="72"/>
                    </a>
                </Link>
                <h1 class="h3 mb-3 font-weight-normal">Авторизация</h1>
                <label for="inputEmail" class="sr-only">Номер телефона</label>
                <input type="text" id="phone" onChange={handlePhone} value={phone} class="form-control mb-2" placeholder="Номер телефона" required="" autofocus=""/>
                <label for="inputPassword" class="sr-only">Пароль</label>
                <input type="password" id="password" onChange={handlePassword} value={password} class="form-control" placeholder="Пароль" required=""/>
                <div class="checkbox mb-3">
                    <label>
                    <input type="checkbox" value="remember-me"/> Запомнить меня
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" onClick={login}>Войти</button>
                <p class="mt-5 mb-3 text-muted">© 2021</p>
            </div>
        // </Layout>
    )
}