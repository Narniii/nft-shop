import { Box, Typography } from "@mui/material";
import React from "react";
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import './Home.css'
import TxtButton from '../../components/TxtButton';
import CustomTitle from "../../components/CustomTitle";
import CustomSlider from "../../components/CustomSlider";
import { collections } from './collection'
let shops = collections.slice(-10)

export default function TrendingShops() {

    return (
        <div className="container">
            <CustomTitle variant='h1' isCenter={true} fontWeight='bold' margin="50px 0px" text="Trending shops" />
            <div className="slider-container">
                <CustomSlider>
                    {shops.map((shop, index) => {
                        return <div key={index}>
                            <Box sx={{
                                backgroundImage: BG_URL(PUBLIC_URL(shop.image)),
                                backgroundPosition: ' center',
                                backgroundSize: 'cover',
                                height: { xs: '300px', sm: '600px' },
                                width: '95%',
                                margin: '15px auto',
                                boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.9)',
                                borderRadius: '22px',
                                position: 'relative',
                            }}>
                                <Box className="trending-number-placeholder" sx={{
                                    width: { xs: '35px', sm: '60px' },
                                    height: { xs: '35px', sm: '60px' },
                                }}>{index + 1}</Box>
                                <Box className="trending-overlay-container">
                                    <Box className="trending-overlay-content-wrapper overFlowHandler" >
                                        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{shop.name}</Typography>
                                        <div className="trending-short-description overFlowHandler" style={{ height: '100px', overflowY: 'scroll', marginTop: '10px' }}>{shop.description}</div>
                                    </Box>
                                </Box>
                            </Box>
                        </div>
                    })}
                </CustomSlider>
            </div >
            <div className="text-center" style={{ margin: '50px 0px' }}>
                <TxtButton text="See All Shops" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
            </div>
        </div >
    );

}