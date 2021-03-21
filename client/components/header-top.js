export default function HeaderTop(){
    return (
        <div className="header-top pt-2 pb-2 bg-dark">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-12 d-flex flex-wrap justify-content-between">
                        <div className="contact-box">
                            <span> <a href="#"><i className="fas fa-phone-square-alt"></i> 123-58794069</a> </span>
                            <span> <a href="#"><i className="fas fa-envelope-open-text"></i> supportfoodkhan@.com</a></span>
                        </div>
                        <div className="social-box">
                            <span><a href="#"><i className="fab fa-facebook"></i></a></span>
                            <span><a href="#"><i className="fab fa-twitter"></i></a></span>
                            <span><a href="#"><i className="fab fa-linkedin-in"></i></a></span>
                            <span><a href="#"><i className="fab fa-instagram"></i></a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}