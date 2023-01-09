import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import CustomTitle from '../../components/CustomTitle'
import NftCards from '../../components/NftCards'
import { API_CONFIG } from '../../config'
import { COLLECTION_API } from '../../data/collection_api'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import LoadingComponent from '../../components/loading/LoadingComponent'
export default function AllGenCol() {
    const theme = useTheme()
    const apiCall = useRef(undefined)
    const [err, setErr] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState(undefined)
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
                path: `/cmd/col/gen/all/`,
                method: "get",
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
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
    return (
        <section>
            <Box sx={{ backgroundImage: BG_URL(PUBLIC_URL('images/bg.avif')), width: '100%', height: '200px', backgroundPosition: 'center', backgroundSize: 'cover' }} />
            <div className='container'>
                <Box sx={{ margin: '30px 0px' }}>
                    <CustomTitle text={`All collections`} fontWeight="bold" variant="h2" isCenter={true} />
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
                                        {console.log(`/creator/${collection.creator}`)}
                                        <NftCards
                                            title={`${collection.title}`}
                                            description={`${collection.description}`}
                                            bgImage={BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`))}
                                            image={BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`))}
                                            creator={collection.creator}
                                            creatorLink={`/creator/${collection.creator}`}
                                            link={`/collections/gen/${collection._id.$oid}`}
                                        />
                                    </div>
                                })}
                            </div>
                }
            </div>
        </section >
    )
}
