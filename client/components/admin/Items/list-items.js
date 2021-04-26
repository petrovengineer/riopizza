export default function ListItems({items, change}){
    return (
        <div className='row'>
            <div className="table-responsive">
                <table className='table bg-white shadow'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Название</th>
                            <th>Место в списке</th>
                            <th>Группа</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, i)=>(
                        <tr key={i+'it'}>
                            <td>{item.value}</td>
                            <td>{item.sort}</td>
                            <td>{item.group && item.group.name}</td>
                            <td className='d-flex'>
                                <button className='btn mr-2' onClick={()=>{removeItem(item._id)}}>Удалить</button>
                                <button className='btn' onClick={()=>{change(item)}}>Изменить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    )
}