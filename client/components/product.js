import Link from 'next/link'

export default function Product({product}){
    let {_id, name = 'No name', description = '', img} = product;
    return (
        <div className='col-sm'>
            <img src={img?img:'/images/pizza.jpg'} style={{width: '100%'}}/>
            <Link href={'/products/'+_id}>{name}</Link><br/>
            {description}<br/>
        </div>
    )
}