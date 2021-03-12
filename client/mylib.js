import axios from "axios";

export function Element(url, data, setData){
    this.url = url;
    this.fetch = async function(){
        const {data} = await axios.get(this.url);
        setData(data);
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
            await axios.put(this.url, args)
            const newData = [...data];
            const index = newData.findIndex(d=>d._id===args._id);
            Object.assign(newData[index], args);
            setData(newData);
        }catch{alert('Ошибка, обратитесь к администратору!')}
    }
}