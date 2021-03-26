import axios from 'axios'
import AppContext from '../context'
import {useState, useContext} from 'react'
import Layout from '../components/layout'
import {useRouter} from 'next/router'
import Link from 'next/link'

export default function Login(){
    const router = useRouter();
    const [phone, changePhone] = useState('');
    const [name, changeName] = useState('');
    const [password, changePassword] = useState('');
    const [password2, changePassword2] = useState('');
    const context = useContext(AppContext);
    const handlePhone = (e)=>{
        changePhone(e.currentTarget.value);
    }
    const handleName = (e)=>{
        changeName(e.currentTarget.value);
    }
    const handlePassword = (e)=>{
        changePassword(e.currentTarget.value);
    }
    const handlePassword2 = (e)=>{
        changePassword2(e.currentTarget.value);
    }
    const reg = async ()=>{
        try{
            console.log("API ", process.env.NEXT_PUBLIC_API)
            let re = /\+(\b7\d{10}\b)/;
            var valid = re.test(phone);
            if(!valid){
                alert('Неверный формат телефона!');
                return;
            }
            await axios.post(process.env.NEXT_PUBLIC_API+'/auth/reg', {name, phone, password});
            router.push('/login');
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
                <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                {/* <label htmlFor="inputEmail" className="sr-only">Номер телефона</label> */}
                <input type="text" id="name" onChange={handleName} value={name} className="form-control mb-2" placeholder="Имя" required="" autofocus=""/>
                <label htmlFor="inputEmail" className="sr-only">Номер телефона</label>
                <input type="text" id="phone" onChange={handlePhone} value={phone} className="form-control mb-2" placeholder="Номер телефона" required="" autofocus=""/>
                <label htmlFor="inputPassword" className="sr-only">Пароль</label>
                <input type="password" id="password" onChange={handlePassword} value={password} className="form-control" placeholder="Пароль" required=""/>
                <label htmlFor="inputPassword" className="sr-only mt-2">Повторите пароль</label>
                <input type="password" id="password" onChange={handlePassword2} value={password2} className="form-control mt-2 mb-2" placeholder="Повторите пароль" required=""/>
                <button className="btn btn-lg btn-primary btn-block" onClick={reg}>Подтвердить</button>
                <p className="mt-5 mb-3 text-muted">© 2021</p>
            </div>
        // </Layout>
    )
}