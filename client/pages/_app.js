import '../styles/bootstrap.css'
import '../styles/globals.scss'

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3100';
// axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

// axios.interceptors.request.use(request => {
//     console.log(request);
//     // Edit request config
//     return request;
// }, error => {
//     console.log(error);
//     return Promise.reject(error);
// });

// axios.interceptors.response.use(response => {
//     console.log(response);
//     // Edit response config
//     return response;
// }, error => {
//     console.log(error);
//     return Promise.reject(error);
// });


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


export default MyApp
