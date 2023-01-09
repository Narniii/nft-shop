import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import CustomTitle from '../../components/CustomTitle'
import NftCards from '../../components/NftCards'
import { API_CONFIG } from '../../config'
import { COLLECTION_API } from '../../data/collection_api'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import LoadingComponent from '../../components/loading/LoadingComponent'
import TxtButton from '../../components/TxtButton'
export default function Explore() {
    const theme = useTheme()
    const apiCall = useRef(undefined)
    const [err, setErr] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState(undefined)
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(3)
    const [endOfCols, setEndOfCols] = useState(false)
    const [loadMoreLoading, setLoadMoreLoading] = useState(false)

    const location = useLocation();

    useEffect(() => {
        getCollections()
    }, [location])
    useEffect(() => {
        return () => {
            if (apiCall.current != undefined)
                apiCall.current.cancel()
        }
    }, [])
    const getCollections = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/load/`,
                method: "post",
                body: {
                    from: from,
                    to: to,
                }
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            let tempFrom = from + 3
            let tempTo = to + 3
            setFrom(tempFrom)
            setTo(tempTo)
            setCollections(response.data)
            setErr(undefined)
            setLoading(false)
        }
        catch (err) {
            if (err.status == 404) {
                setCollections([])
            }
            else if (err.status == 500) {
                setErr("Internal Server Error")
            }
            else {
                setErr("Failed to fetch")
            }
            setLoading(false)
        }
    }
    const loadMore = async () => {
        setLoadMoreLoading(true)
        console.log(from)
        console.log(to)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/load/`,
                method: "post",
                body: {
                    from: from,
                    to: to,
                }
            });
            const response = await apiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            let tempFrom = from + 3
            let tempTo = to + 3
            setFrom(tempFrom)
            setTo(tempTo)
            var tempCol = collections;
            for (var q = 0; q < response.data.length; q++) {
                tempCol.push(response.data[q])
            }
            setCollections(tempCol)
            setLoadMoreLoading(false)
        }
        catch (err) {
            if (err.status == 404) {
                setEndOfCols(true)
            }
            else if (err.status == 500) {
                setErr("Internal Server Error")
            }
            else {
                setErr("Failed to fetch")
            }
            console.log(err)
            setLoadMoreLoading(false)
        }
    }
    return (
        <section>
            <Box sx={{ backgroundImage: BG_URL(PUBLIC_URL('images/bg.avif')), width: '100%', height: '200px', backgroundPosition: 'center', backgroundSize: 'cover' }} />
            <div className='container'>
                <Box sx={{ margin: '30px 0px' }}>
                    <CustomTitle text={`Explore new collections`} fontWeight="bold" variant="h2" isCenter={true} />
                    {/* <Typography sx={{ width: '50%', margin: '20px auto', textAlign: 'justify' }}>Music NFTs are changing the way fans connect with their favorite artists. From 3LAU to Imogen Heap, all kinds of creators are innovating on the blockchain, and the appetite for change in an industry that so often underserves independent makers is clear. */}
                    {/* Browse collections from The Weeknd, Richie Hawtin, RAC, and more.</Typography> */}
                    {/* <CustomTitle text="Trending Collections" fontWeight="bold" variant="h3" isCenter={true} /> */}
                </Box>
                {loading ?
                    <Box sx={{ minHeight: "40vh" }}>
                        <LoadingComponent
                            isGrid={true}
                            ColNumber={3}
                            responsiveColNumber={1}
                            elementType={"rounded"}
                            elementWidth={"100%"}
                            elementHeight="300px"
                            responsiveElementWidth="100%"
                            responsiveElementHeight="300px"
                            elementCount={3}
                            responsiveCount={1}
                        />
                    </Box> :
                    err ?
                        <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography sx={{ color: 'red' }}>{err}</Typography>
                        </Box>
                        :
                        collections.length === 0 ?
                            <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography sx={{ color: theme.pallete.lightBlue }}>No collections found</Typography>
                            </Box>
                            :
                            <div className='row'>
                                {collections.map((collection, index) => {
                                    return <div className='col-md-4' key={index}>
                                        {/* {console.log(`/creator/${collection.creator}`)} */}
                                        <NftCards
                                            title={`${collection.title}`}
                                            description={`${collection.description}`}
                                            bgImage={BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`))}
                                            image={BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`))}
                                            creator={collection.creator}
                                            creatorLink={`/creator/${collection.creator}`}
                                            link={`/collections/${collection._id.$oid}`}
                                        />
                                    </div>
                                })}
                                {endOfCols ? undefined :
                                    <div className='text-center' style={{ width: "auto", margin: '10px auto' }}>
                                        {
                                            loadMoreLoading ?
                                                <TxtButton
                                                    text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)"
                                                    width='190px' />
                                                :
                                                <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={loadMore}>
                                                    <TxtButton
                                                        text="Load More"
                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                        borderColor="rgba(27, 127, 153, 1)" />
                                                </div>
                                        }
                                    </div>
                                }
                            </div>
                }
            </div>
        </section >
    )
}
