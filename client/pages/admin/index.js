import Layout from "../../components/admin/layout";
import {useRouter} from 'next/router' 
import { useEffect } from "react";

export default function Admin(){
    const router = useRouter()
    useEffect(()=>{
        router.push('/admin/products');
    },[])
    return null
}