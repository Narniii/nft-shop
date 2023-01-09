import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CardWithBordersAndBgColor from '../../components/CardWithBordersAndBgColor';
import CardWithTitle from '../../components/CardWithTitle';
import LoadingComponent from '../../components/loading/LoadingComponent';
import { COLLECTION_API } from '../../data/collection_api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TxtButton from '../../components/TxtButton';

export default function AttributeSearch() {
    const theme = useTheme()
    let [searchParams, setSearchParams] = useSearchParams();
    const property = searchParams.get('property')
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(undefined)
    const [nfts, setNfts] = useState(undefined)
    const apiCall = useRef(undefined)
    const [nearUSDT, setNearUSDT] = useState(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        apiCall.current = undefined
        setLoading(true)
        setErr(undefined)
        search()
    }, [property])

    const search = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: "/cmd/nft/srch/prop/",
                method: "post",
                body: { property: property }
            })
            let response = await apiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            setNfts(response.data)
            setLoading(false)
        } catch (error) {
            if (error.status === 404) setErr("We could not find any results for the given phrase.")
            else setErr("Internal server error")
            setLoading(false)
            apiCall.current = undefined
        }
    }
    useEffect(() => {
        const interval = setInterval(() => getData(), 30000);
        return () => {
            clearInterval(interval)
            if (apiCall.current !== undefined)
                apiCall.current.cancel()
        }
    }, [])
    const getData = () => {
        let nearPrice = localStorage.getItem("nearPrice")
        setNearUSDT(nearPrice)
        return nearPrice
    }

    const nearPrice = useMemo(() => getData(), [nearUSDT]);

    const handleRedirect = async (id) => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: "/cmd/nft/get/",
                body: { nft_id: id },
                method: "post"
            })
            const response = await apiCall.current.promise;
            if (!response.isSuccess) throw response
            navigate(`/collections/${response.data[0].collection_title}/assets/${id}`)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section className="container">
            <Typography variant='h5' sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>NFTs with <span style={{ color: theme.pallete.lightBlue }}>{property}</span> property</Typography>
            {loading ? <Box sx={{ margin: '20px 0px' }}>
                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px auto" }} variant={"rounded"} width={"100%"} height={'200px'} />
                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px auto" }} variant={"rounded"} width={"100%"} height={'200px'} />
                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px auto" }} variant={"rounded"} width={"100%"} height={'200px'} />
            </Box> :
                err ? <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                    <Typography sx={{ color: theme.pallete.lightBlue }}>{err}</Typography>
                </Box>
                    :
                    <Box sx={{ paddingBottom: '32px' }}>
                        <Box className="row">
                            {nfts.map((nft, index) => {
                                return <div className="col-md-4" key={index}>
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
                                            <TxtButton text="View" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} onClick={() => handleRedirect(nft._id.$oid)} />
                                        </div>
                                    </CardWithBordersAndBgColor>
                                </div>
                            })}
                        </Box>
                    </Box>
            }
        </section>
    )
}
