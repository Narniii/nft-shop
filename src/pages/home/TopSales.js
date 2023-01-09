import { Box } from '@mui/material'
import React from 'react'
import CardWithBordersAndBgColor from '../../components/CardWithBordersAndBgColor'
import CardWithTitle from '../../components/CardWithTitle'
import CustomSlider from '../../components/CustomSlider'
import CustomTitle from '../../components/CustomTitle'
import TxtButton from '../../components/TxtButton'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import { shops } from './shops'

export default function TopSales() {
    return (
        <div className='container'>
            <CustomTitle variant='h1' isCenter={true} fontWeight='bold' margin="50px 0px" text="Top Sales" />
            <CustomSlider>
                {shops.map((shop, index) => {
                    return <div key={index}>
                        <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                            <div style={{ position: 'relative' }}>
                                <Box sx={{
                                    backgroundImage: BG_URL(PUBLIC_URL('images/mug.png')),
                                    width: '100%',
                                    height: { xs: '150px', md: '250px' },
                                    backgroundSize: '150px',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }} />
                                <Box sx={{
                                    backgroundImage: BG_URL(PUBLIC_URL(shop.nft_image)),
                                    width: '80px',
                                    height: '80px',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'absolute',
                                    top: { xs: '35px', md: '70px', lg: '90px' },
                                    left: { xs: '35%', md: '85px', lg: '135px' }
                                }} />
                            </div>
                            <CardWithTitle title={`${shop.collection_name}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                <div className="row">
                                    <div className="col-6">
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ margin: '5px' }}>item sold</div>
                                            <div>{Math.floor(Math.random() * 100)}</div>
                                        </div>
                                    </div>
                                    <div className="col-6 text-center">
                                        <div>Price</div>
                                        <div>
                                            <img src={PUBLIC_URL('images/eth.png')} alt="crypto-logo" style={{ width: '10%', display: 'inline-block' }} />
                                            <span>{shop.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardWithTitle>
                            <div className="text-center" style={{ margin: '10px 0px' }}>
                                <TxtButton text="Buy Now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                            </div>
                        </CardWithBordersAndBgColor>
                    </div>
                })}
            </CustomSlider>
            <div className="text-center" style={{ margin: '40px 0px' }}>
                <TxtButton text="See All Top Sales" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
            </div>
        </div>
    )
}
