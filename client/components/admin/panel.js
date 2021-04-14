export default function Panel({children}){
    return (
			<div className="row bg-secondary p-2 d-flex justify-content-between">
                {children}
            </div>
    )
}