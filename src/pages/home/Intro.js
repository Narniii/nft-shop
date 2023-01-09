import React, { useEffect, useState } from 'react'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ButtonWithLogo from '../../components/ButtonWithLogo';
import CustomTitle from '../../components/CustomTitle';
import { useSelector } from 'react-redux';
export default function Intro() {
    const [loading, setLoading] = useState(true)
    const userDetails = useSelector(state => state.userReducer)
    const [featuredNft, setFeaturedNft] = useState(undefined)
    useEffect(() => {
        if (userDetails && userDetails.nftContract && userDetails.marketContract && featuredNft === undefined) {
            getFeaturedNFT()
        }
    }, [userDetails])
    const getFeaturedNFT = async () => {
        try {
            const res = await userDetails.marketContract.get_sale({
                "nft_contract_token_id": userDetails.marketContract.contractId,
            });
            setFeaturedNft(res)
        } catch (err) {
            console.log(err)
        }
    }

    // function getNanoSecTime() {
    //     const nano = require('nano-seconds');
    //     const ns = nano.now();
    //     console.log(ns)
    //     console.log(nano)
    // }

    // useEffect(() => {
    //     getNanoSecTime()
    // }, [])


    return (
        <div className='container' style={{ marginBottom: 5, marginTop: 20 }}>
            <div className='row'>
                <div className='col-md-6 order-md-2'>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', width: '100%', height: { md: '300px', lg: '100%' }, padding: '20px 0px' }}>
                        <Typography variant='h1' sx={{ textAlign: { xs: 'center', sm: 'left' }, fontWeight: '800', marginBottom: { xs: '20px', sm: '0' } }}>Discover, collect, and sell extraordinary NFTs</Typography>
                        <CustomTitle variant='h4' text={"First NFT marketplace in iran"} />
                        <Stack direction="row" spacing={2} sx={{ margin: { xs: '0 auto', md: 0 } }}>
                            <ButtonWithLogo link="/create/nft" text="Create" logo={<AddCircleOutlineOutlinedIcon sx={{ fontSize: 30 }} />} bgColor={'transparent'} color="white" displayType="inline-block" borderColor={"white"} />
                            <ButtonWithLogo link="/explore" text="Explore" logo={<ExploreOutlinedIcon sx={{ fontSize: 30 }} />} bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                        </Stack>
                    </Box>
                </div>


                <div className='col-md-6 order-md-1'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {featuredNft ?
                            <Paper sx={{ width: { xs: '95%', md: '65%' }, borderRadius: 5, boxShadow: '0px 0px 20px 2px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
                                <div style={{
                                    borderWidth: '3px 3px 0px 3px',
                                    borderColor: '#cdc9c4',
                                    borderStyle: 'solid'
                                }}>
                                    <Box sx={{ width: '100%', backgroundImage: BG_URL(PUBLIC_URL('images/kaf.jpg')), height: { xs: 250, md: 350 }, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                </div>
                                <Box sx={{ padding: '10px' }}>
                                    <div className='row'>
                                        <div className='col-9'>
                                            <div style={{ display: 'inline-block', backgroundImage: BG_URL(PUBLIC_URL('images/kaf.jpg')), width: 50, height: 50, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 25 }} />
                                            <div style={{ display: 'inline-block', verticalAlign: 'top', padding: '5px' }}>
                                                <div>Fishuman #12</div>
                                                <Link style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }} to="/">Fishuman</Link>
                                            </div>
                                        </div>

                                        <div className='col-3'>
                                            <div style={{ padding: '10px 0px', textAlign: 'end' }}>
                                                <InfoIcon sx={{ fontSize: 30 }} />
                                            </div>
                                        </div>

                                    </div>
                                </Box>
                            </Paper>
                            :
                            <Box sx={{
                                backgroundImage: BG_URL(PUBLIC_URL("images/intro.jpg")),
                                width: { xs: '95%', md: '65%' },
                                height: { xs: 250, md: 350 },
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: 5
                            }} />
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}
