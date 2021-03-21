export default function Footer(){
    return(
        <div className="container-fluid bg-dark">
            <div className="container footer pt-4 pb-4" style={{color:'white'}}>
                <div className="d-none d-sm-flex flex-column align-items-start justify-content-around">
                    <div className="footer-item">
                        <i className="fas fa-phone-square-alt mr-2"/>
                        <span>+7-901-701-55-01</span>
                    </div>
                    <div className="footer-item">
                        <i className="fas fa-clock mr-2"/>
                        <span>пн-вс с 9:00-22:00</span>
                    </div>
                    <div className="footer-item">
                        г. Чехов
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <span className="mb-0 mr-4 d-none d-sm-block">Мы в соцсетях</span>
                    <span><a href="#"><i className="fab fa-facebook"></i></a></span>
                    <span><a href="#"><i className="fab fa-twitter"></i></a></span>
                    <span><a href="#"><i className="fab fa-linkedin-in"></i></a></span>
                    <span><a href="#"><i className="fab fa-instagram"></i></a></span>
                </div>
            </div>
        </div>
    )
}