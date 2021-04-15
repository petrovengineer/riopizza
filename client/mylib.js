import axios from "axios";

if(typeof window!='undefined'){
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
      axios.defaults.headers.post['Content-Type'] = 'application/json';
}

export function Element(url, data, setData){
    this.url = process.env.NEXT_PUBLIC_API+url;

    this.toArgs = function(args){
        let query = '?';
        if(args){
            Object.keys(args).map(key=>{
                query += key+'='+args[key]+'&' 
            })
            return query;
        }else return null;
    }

    this.fetch = async function(args){
        try{
            console.log(this.toArgs(args));
            const res = await axios.get(this.url+this.toArgs(args));
            const {data} = res;
            if(!data) return null;
            setData(data);
        }
        catch(e){
            console.log(e)
        }
    }

    this.count = function(){
        return new Promise(async (done, fail)=>{
            try{
                const res = await axios.get(this.url+'/count');
                const {data} = res;
                if(!data) return null;
                done(data);
            }
            catch(e){
                console.log(e)
            }
        })

    }

    this.fetchOne = async function(){
        const {data} = await axios.get(this.url);
            // console.log("DATA ", data)
            setData(((Array.isArray(data) && data.length===1) && data[0]) || null);
    }

    this.fetchWithPromise = function(){
        return new Promise(async (done, fail)=>{
            try{
                const {data} = await axios.get(this.url);
                done(data);
            }catch{
            }
        })
    }

    this.fetchOneWithPromise = function(){
        return new Promise(async (done, fail)=>{
            try{
                const {data} = await axios.get(this.url);
                done(((Array.isArray(data) && data.length===1) && data[0]) || null);
            }catch{
            }
        })
    }

    this.create = async function(args){
        if(!args){alert('Название не должно быть пустым!'); return;}
        const {data: newElement} = await axios.post(this.url, args);
        const newData = [newElement, ...data];
        setData(newData);
    }
    this.remove = async function(_id){
        if(!_id){alert('Id не должен быть пустым!'); return;}
        await axios.delete(this.url+'?_id='+_id);
        const newData = data.filter(d=>d._id!=_id);
        setData(newData);
    }
    this.update = async function(args){
        if(!args){alert('Нет аргументов!'); return;}
        try{
            const {data: newItem} = await axios.put(this.url, args)
            const newData = [...data];
            const index = newData.findIndex(d=>d._id===args._id);
            console.log("NEW ITEM ", newItem)
            Object.assign(newData[index], newItem);
            // Object.assign(newData[index], args);
            setData(newData);
        }catch(e){console.log(e); alert('Ошибка, обратитесь к администратору!')}
    }
    this.updateOne = async function(args){
        if(!args){alert('Нет аргументов!'); return;}
        try{
            const {data} = await axios.put(this.url, args)
            setData(data);
        }catch(e){console.log(e); alert('Ошибка, обратитесь к администратору!')}
    }
}

export function formatTime(iso){
    const addZero = (num)=>{
        return num<10?'0'+num:num
    }
    let date = new Date(iso)
    return addZero(date.getHours()) +':'+addZero(date.getMinutes()) +' '+addZero(date.getDate()) +'.'+Number.parseInt(date.getMonth()+1)+'.'+date.getFullYear()
}
