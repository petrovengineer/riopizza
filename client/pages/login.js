import axios from 'axios'
import AppContext from '../context'
import {useState, useContext} from 'react'
import Layout from '../components/layout'
import {useRouter} from 'next/router'

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
        <Layout>
            <input type="text" id="phone" onChange={handlePhone} value={phone}></input>
            <input type="text" id="password" onChange={handlePassword} value={password}></input>
            <button onClick={login}>Login</button>
        </Layout>
    )
}