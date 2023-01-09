import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CardWithBordersAndBgColor from '../../../components/CardWithBordersAndBgColor'
import CardWithTitle from '../../../components/CardWithTitle'
import TxtButton from '../../../components/TxtButton'
import { BG_URL, PUBLIC_URL } from '../../../utils/utils'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { API_CONFIG } from '../../../config'
import { COLLECTION_API } from '../../../data/collection_api';
import { useMemo } from 'react'


export default function NftTab({ collection, NFTs, loading, err }) {
    const [nearUSDT, setNearUSDT] = useState(undefined)
    useEffect(() => {
        const interval = setInterval(() => getData(), 30000);
        return () => clearInterval(interval)
    }, [])
    const getData = () => {
        let nearPrice = localStorage.getItem("nearPrice")
        setNearUSDT(nearPrice)
        return nearPrice
    }
    const nearPrice = useMemo(() => getData(), [nearUSDT]);
    // const [NFTs, setNFTs] = useState(undefined)
    // const [loading, setLoading] = useState(true)
    // const [err, setErr] = useState(undefined)
    // const nftsApiCall = useRef(undefined)
    const theme = useTheme()
    // useEffect(() => {
    //     getNFTs()
    //     return () => {
    //         if (nftsApiCall.current !== undefined)
    //             nftsApiCall.current.cancel();
    //     }
    // }, [])

    // const getNFTs = async () => {
    //     try {
    //         nftsApiCall.current = COLLECTION_API.request({
    //             path: `/cmd/col/nfts/`,
    //             method: "post",
    //             body: { collection_id: collection._id.$oid },
    //         });
    //         let response = await nftsApiCall.current.promise;
    //         console.log(response)
    //         if (!response.isSuccess)
    //             throw response
    //         setNFTs(response.data)
    //         setLoading(false)
    //     }
    //     catch (err) {
    //         console.log(err)
    //         if (err.status == 404)
    //             setNFTs([])
    //         else if (err.status == 500)
    //             setErr('Internal server error occured.')
    //         else
    //             setErr('Something unexpected happend')
    //         setLoading(false)
    //     }
    // }
    return (
        <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '80%' } }}>
            {loading ?
                <Box className='text-center' sx={{ paddingTop: '20px' }} >
                    <CircularProgress />
                </Box>
                :
                err ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '20vh' }}>
                    <Typography variant='h4' sx={{ textAlign: 'center', color: 'red' }}>{err}</Typography>
                </Box>
                    :
                    NFTs.length === 0 ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '30vh' }}>
                            <Typography variant='h4' sx={{ textAlign: 'center', color: theme.pallete.lightBlue }}>No NFTs found</Typography>
                        </Box>
                        :
                        <div className='row'>
                            {NFTs.map((nft, index) => {
                                return <div className="col-md-4" key={index}>
                                    <Link to={`/collections/${collection.title}/assets/${nft._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                        <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                            <Box sx={{
                                                backgroundImage: `url(${nft.media})`,
                                                height: { xs: '150px', sm: '200px', md: '250px' },
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                margin: '10px',
                                                borderRadius: '15px',
                                            }} />
                                            <CardWithTitle title={`${nft.title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                                <div className="row">
                                                    <div className="col-5">
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                            <span>{nft.likes.length}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-7">
                                                        <div>Price</div>
                                                        <div>
                                                            <span>{nft.price} Ⓝ</span>
                                                            {
                                                                nearPrice !== undefined ?
                                                                    <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;~{parseFloat((nft.price * nearPrice).toString().substring(0, 5))} USD</span>
                                                                    : undefined
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardWithTitle>
                                            <div className="text-center" style={{ margin: '10px 0px' }}>
                                                <TxtButton text="View" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                                            </div>
                                        </CardWithBordersAndBgColor>
                                    </Link>
                                </div>
                            })}
                        </div>

            }

        </Box >
    )
}
