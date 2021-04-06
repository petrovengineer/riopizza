export default function Table({head=[], children}){
    return (
        <div className='table-responsive shadow bg-white'>
            <table className='table'>
                <thead>
                    <tr>
                        {head.map(h=><th>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    )
}