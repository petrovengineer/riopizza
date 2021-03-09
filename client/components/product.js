export default function Product({product}){
    let {name = 'No name', description = '', extParameters = []} = product;
    return (
        <div>
            {name}<br/>
            {description}<br/>
            {extParameters.map((parameter,i) =><Parameter key={i+'pa'} parameter = {parameter}/>)}
        </div>
    )
}

function Parameter({parameter}){
    let {
            name = 'No name', 
            value = null,
            extAvailableItems = [],
            unit = '',
            type = 0 
        } = parameter;
    return(
        <div>
            {name}<br/>
            {
                type===0?<ValueType value = {value} unit = {unit}/>:
                type===1?<CheckableType extAvailableItems = {extAvailableItems}/>:
                type===2?<SelectType extAvailableItems = {extAvailableItems}/>:''
            }
        </div>
    )
}

function ValueType({value, unit}){
    return(
        <h3>{value} {unit}</h3>
    )
}

function CheckableType({extAvailableItems}){
    return(
        <div>
            {extAvailableItems.map((item, i)=><Checkbox key={i+"ch"} name={item.value} value={item._id}/>)}
        </div>
    )
}

function SelectType({extAvailableItems}){
    return(
        <div>
            {extAvailableItems.map((item, i)=><Radio key={i+"ra"} name={item.value} value={item._id}/>)}
        </div>
    )
}

function Checkbox({name, value}){
    return(
        <><input type="checkbox" name={name} value={value}/>{name}</>
    )
}

function Radio({name, value}){
    return(
        <><input type="radio" name={name} value={value}/>{name}</>
    )
}