import {useEffect} from 'react'
var Carousel = require('react-responsive-carousel').Carousel;

export default function Slider(){
    useEffect(()=>{

    },[])
    return(
        <div className='container mt-2'>
            <Carousel autoPlay emulateTouch infiniteLoop showStatus={false} showThumbs={false}
                // showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}
            >
                    <div>
                        <img src="/images/banner1.png" />
                        {/* <p className="legend">Legend 1</p> */}
                    </div>
                    <div>
                        <img src="/images/banner1.png" />
                        {/* <p className="legend">Legend 1</p> */}
                    </div>
                    <div>
                        <img src="/images/banner1.png" />
                        {/* <p className="legend">Legend 3</p> */}
                    </div>
            </Carousel>
        </div>

    )
}