import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Slider from "react-slick";
import { Box } from '@mui/material';

function SampleNextArrow(props) {
    const { onClick } = props;
    return (
        <Box
            sx={{
                display: "flex",
                background: "#434658",
                width: { xs: '25px', sm: '60px' },
                height: { xs: '25px', sm: '60px' },
                borderRadius: '50px',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: ' 50%',
                right: '0px',
                transform: 'translate(0, -50%)',
                boxShadow: '0px 0px 20px 3px rgba(0,0,0,0.5)',
                border: '2px solid #696b79',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <NavigateNextIcon sx={{ fontSize: { xs: '20px', sm: '50px' }, color: '#bdbec7' }} />
        </Box>
    );
}

function SamplePrevArrow(props) {
    const { onClick } = props;
    return (
        <Box
            sx={{
                display: "flex",
                background: "#434658",
                width: { xs: '25px', sm: '60px' },
                height: { xs: '25px', sm: '60px' },
                borderRadius: '50px',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: ' 50%',
                left: '0px',
                transform: 'translate(0, -50%)',
                boxShadow: '0px 0px 20px 3px rgba(0,0,0,0.5)',
                border: '2px solid #696b79',
                cursor: 'pointer'
            }}
            onClick={onClick}
        >
            <NavigateBeforeIcon sx={{ fontSize: { xs: '20px', sm: '50px' }, color: '#bdbec7' }} />
        </Box>
    );
}
export default function CustomSlider({ children, slidesCount }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slidesCount ? slidesCount : 3,
        slidesToScroll: slidesCount ? slidesCount : 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesCount ? slidesCount : 3,
                    slidesToScroll: slidesCount ? slidesCount : 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: slidesCount ? slidesCount : 2,
                    slidesToScroll: slidesCount ? slidesCount : 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
        appendDots: dots => {
            const customDots = React.Children.map(dots, dot => {
                if (dot.props['className'] === 'slick-active') {
                    return React.cloneElement(dot, {
                        style: {
                            background: '#04a5c3',
                            borderRadius: '50%',
                            position: 'relative',
                            width: '15px',
                            height: '15px',
                            margin: '0 5px',
                            cursor: 'pointer',
                        },
                    });
                } else {
                    return React.cloneElement(dot, {
                        style: {
                            background: '#1b6d81',
                            borderRadius: '50%',
                            position: 'relative',
                            width: '7px',
                            height: '7px',
                            margin: '0 5px',
                            cursor: 'pointer',
                            verticalAlign: 'sub'
                        },
                    });
                }
            });

            return (
                <div>
                    <ul style={{ padding: 0, margin: 0 }} > {customDots} </ul>
                </div >
            );
        }
    }
    return (
        <Slider {...settings} className="slider-parent">
            {children}
        </Slider>
    )
}
