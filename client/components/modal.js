export default function Modal({children, close}){
    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{children[0]}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>{close()}}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div>{children[1]}</div>
                </div>
                <div className="modal-footer">
                    {children[2]}
                </div>
                </div>
            </div>
        </div>
    )
}