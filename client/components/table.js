export default function Table({head=[], children, theadDark}){
    return (
        <div className='table-responsive shadow bg-white'>
            <table className='table'>
                <thead className={theadDark?'thead-dark':''}>
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