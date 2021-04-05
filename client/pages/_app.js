import '../styles/bootstrap.css'
import '../styles/carousel.css'
import '../styles/globals.scss'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import AppContext from '../context'

axios.defaults.baseURL = 'http://localhost:3100/api';

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    user: null,
    accessToken: null,
    refreshToken: null,
    cart: [],
    orders: null,
  });
  useEffect(()=>{
    let newState = {};
    for(var key in state){
      const local = localStorage.getItem(key);  
      if(!state[key] || state[key].length==0){
        newState[key] = new Persistent(key, JSON.parse(local));
      }else {
        newState[key] = state[key]
      }
    }
    setState(newState);
  }, [])

  function Persistent(name, value){
    this.name = name;
    this.value = value;
    this.set = function (context, newValue){
      let newState = {...context};
      newState[this.name].value = newValue;
      localStorage.setItem(this.name, JSON.stringify(newValue));
      setState(newState);
    }
    this.clear = function(context){
      localStorage.removeItem(this.name);
      const newState = {...context}
      newState[this.name].value = null;
      setState(newState);
    }
  }

  useEffect(()=>{
    if(state.accessToken!=null){
      // axios.defaults.baseURL = process.env.API;
      axios.interceptors.request.use(
        config => {
          if (!config.headers.Authorization) {
            const token = JSON.parse(localStorage.getItem("accessToken"));
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
          return config;
        },
        error => Promise.reject(error)
      );
      // axios.defaults.headers.common['Authorization'] = 'Bearer '+state.accessToken.get;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
    }
  }, [state.accessToken])

  return <AppContext.Provider value={state}><div className='fixed-fon'></div><Component {...pageProps} /></AppContext.Provider>
}


export default MyApp

// const [state, setStateSimple] = useState({
//   customer: null,
//   accessToken: null,
//   refreshToken: null,
//   cart: [],
// });
// const persist = (name, value)=>{
//   return {
//     get: value,
//     set:(value)=>{
//       if(JSON.stringify(value)!==localStorage.getItem(name)){
//         localStorage.setItem(name, JSON.stringify(value))
//       };
//       const newState = Object.assign({}, state);
//       newState[name].get = value;
//       setStateSimple(newState);
//     },
//     clear:()=>{
//       localStorage.removeItem(name);
//       const newState = Object.assign({}, state);
//       newState[name].get = null;
//       setStateSimple(newState);
//     }
// }}

// const restore = (name)=>{
//     const local = localStorage.getItem(name);      
//     if((state[name].get==null || state[name].get.length==0) && local!=null){
//       state[name].set(JSON.parse(local));
//     }else{
//       state[name].set(state[name].get);
//     }
//   }
// useEffect(()=>{
//   for(var key in state){
//     if(state[key]==null || state[key].length==0){state[key] = persist(key, state[key]);}
//     restore(key);
//   }
// }, [])
// useEffect(()=>{
//   if(state.accessToken!=null){
//     axios.defaults.baseURL = process.env.API;
//     axios.interceptors.request.use(
//       config => {
//         if (!config.headers.Authorization) {
//           const token = JSON.parse(localStorage.getItem("accessToken"));
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//         }
//         return config;
//       },
//       error => Promise.reject(error)
//     );
//     // axios.defaults.headers.common['Authorization'] = 'Bearer '+state.accessToken.get;
//     axios.defaults.headers.post['Content-Type'] = 'application/json';
//   }
// }, [state.accessToken])
