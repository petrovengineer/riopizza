export default function Footer(){
    return(
        <div className="bg-dark footer">
            <div className="container pb-4 pt-4">
                <div className='row'>
                    <div className="col-8 d-flex" style={{flexWrap: 'wrap'}}>
                        <div className="mr-2 d-inline-block">
                            <i className="fas fa-phone-square-alt mr-2"/>
                            <span>+7-901-701-55-01</span>
                        </div>
                        <div className="mr-2 d-inline-block">
                            <i className="fas fa-clock mr-2"/>
                            <span>пн-вс с 9:00-22:00</span>
                        </div>
                        {/* <div className="d-inline-block">
                            г. Чехов
                        </div> */}
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-end">
                        <span className="mb-0 mr-4 d-none d-sm-block">Мы в соцсетях</span>
                        <span><a href="#"><i className="fab fa-facebook"></i></a></span>
                        <span><a href="#"><i className="fab fa-twitter"></i></a></span>
                        <span><a href="#"><i className="fab fa-linkedin-in"></i></a></span>
                        <span><a href="#"><i className="fab fa-instagram"></i></a></span>
                    </div>
                </div>
            </div>
        </div>
    )
}