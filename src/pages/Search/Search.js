import { Box, Skeleton, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { set } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CardWithBordersAndBgColor from '../../components/CardWithBordersAndBgColor';
import CardWithTitle from '../../components/CardWithTitle';
import { API_CONFIG } from '../../config';
import { COLLECTION_API } from '../../data/collection_api';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMemo } from 'react';
import TxtButton from '../../components/TxtButton';

export default function Search() {
    const navigate = useNavigate()
    const theme = useTheme()
    let [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query')
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(undefined)
    const [collections, setCollections] = useState(undefined)
    const [generativeCols, setGenerativeCols] = useState(undefined)
    const [nfts, setNfts] = useState(undefined)
    const apiCall = useRef(undefined)
    const [nearUSDT, setNearUSDT] = useState(undefined)

    useEffect(() => {
        const interval = setInterval(() => getData(), 30000);
        return () => {
            clearInterval(interval)
            if (apiCall.current !== undefined)
                apiCall.current.cancel()
        }
    }, [])

    useEffect(() => {
        apiCall.current = undefined
        setLoading(true)
        setErr(undefined)
        search()
    }, [query])

    useEffect(() => {
        if (nfts !== undefined && generativeCols !== undefined && collections !== undefined)
            setLoading(false)
    }, [collections, generativeCols, nfts])

    const getData = () => {
        let nearPrice = localStorage.getItem("nearPrice")
        setNearUSDT(nearPrice)
        return nearPrice
    }


    const search = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: "/cmd/search/",
                method: "post",
                body: { phrase: query }
            })
            let response = await apiCall.current.promise
            if (!response.isSuccess)
                throw response
            let result = response.data
            if (result.length == 0) {
                setErr("We could not find any results for the given phrase.")
                setLoading(false)
            }
            var _cols = undefined
            var _generativeCols = undefined
            var _nfts = undefined
            for (var i = 0; i < result.length; i++) {
                if (result[i].collections) _cols = result[i].collections
                if (result[i].generative_collections) _generativeCols = result[i].generative_collections
                if (result[i].nfts) _nfts = result[i].nfts
            }

            if (_cols === undefined) { setCollections([]) }
            else setCollections(_cols)

            if (_generativeCols === undefined) setGenerativeCols([])
            else setGenerativeCols(_generativeCols)

            if (_nfts === undefined) setNfts([])
            else setNfts(_nfts)

        } catch (error) {
            if (error.status === 404) setErr("We could not find any results for the given phrase.")
            if (error.status === 400) setErr("We could not find any results for the given phrase.")
            else setErr("Internal server error")
            setLoading(false)
            apiCall.current = undefined
        }
    }
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
    const nearPrice = useMemo(() => getData(), [nearUSDT]);

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: { md: 0, lg: 3 } }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    return (
        <section className="container">
            <Typography variant='h5' sx={{ marginTop: 4, marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>Results for with <span style={{ color: theme.pallete.lightBlue }}>{query}</span></Typography>

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
                        <Box className="accardeon-wrapper" sx={{ width: '100%', color: 'white' }}>
                            <Box sx={{ width: { sm: '100%', md: '97%' }, margin: '0 auto' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} onChange={handleChange}>
                                        <Tab fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} label={<Box><Typography sx={{ margin: '1px 0px' }}>NFTs</Typography> </Box>} />
                                        <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Collections</Typography> </Box>} />
                                        <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Generative collections</Typography> </Box>} />
                                    </Tabs>
                                </Box>
                                <div className='row' style={{ margin: 0 }}>
                                    <div className='col-12'>
                                        <TabPanel value={value} index={0}>
                                            {nfts.length != 0 ?
                                                <>
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
                                                </>
                                                :
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                                                    <Typography sx={{ color: theme.pallete.lightBlue }}>We could not find any results for the given phrase</Typography>
                                                </Box>
                                            }
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            {collections.length != 0 ?
                                                <>
                                                    <Box className='row'>
                                                        {collections.map((collection) => {
                                                            return <div className='col-6 col-md-4' key={collection._id.$oid}>
                                                                <Link to={`/collections/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                                    <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                                        <Box sx={{
                                                                            backgroundImage: `url(${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path})`,
                                                                            height: { xs: '150px', sm: '300px' },
                                                                            backgroundSize: 'cover',
                                                                            backgroundPosition: 'center',
                                                                            margin: '10px',
                                                                            borderRadius: '15px',
                                                                        }} />
                                                                        <CardWithTitle title={`${collection.title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                                                            <div className="row">
                                                                                <div className="col-5">
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                                                        <span>{collection.likes.length}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-7">
                                                                                    <div>Floor Price</div>
                                                                                    <div>
                                                                                        {/* <img src={PUBLIC_URL('images/eth.png')} alt="crypto-logo" style={{ width: '10%', display: 'inline-block' }} /> */}
                                                                                        {collection.floor_price ?
                                                                                            <span>{collection.floor_price} Ⓝ</span>
                                                                                            : <span>0</span>}
                                                                                        {
                                                                                            nearPrice !== undefined && collection.floor_price && collection.floor_price != 0 ?
                                                                                                <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;&nbsp;~{parseFloat((collection.floor_price * nearPrice).toString().substring(0, 5))} USD</span>
                                                                                                : undefined
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardWithTitle>
                                                                        <div className="text-center" style={{ margin: '30px 0px' }}>
                                                                            {/* <TxtButton text="Buy now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} /> */}
                                                                        </div>
                                                                    </CardWithBordersAndBgColor>
                                                                </Link>
                                                            </div>
                                                        })}
                                                    </Box>
                                                </>
                                                :
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                                                    <Typography sx={{ color: theme.pallete.lightBlue }}>We could not find any results for the given phrase</Typography>
                                                </Box>
                                            }
                                        </TabPanel>
                                        <TabPanel value={value} index={2}>
                                            {generativeCols.length != 0 ?
                                                <>
                                                    <Box className="row">
                                                        {generativeCols.map((collection) => {
                                                            return <div className='col-6 col-md-4' key={collection._id.$oid}>
                                                                <Link to={`/collections/gen/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                                    <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                                        <Box sx={{
                                                                            backgroundImage: `url(${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path})`,
                                                                            height: { xs: '150px', sm: '300px' },
                                                                            backgroundSize: 'cover',
                                                                            backgroundPosition: 'center',
                                                                            margin: '10px',
                                                                            borderRadius: '15px',
                                                                        }} />
                                                                        <CardWithTitle title={`${collection.title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                                                            <div className="row">
                                                                                <div className="col-5">
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                                                        <span>{collection.likes.length}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-7">
                                                                                    <div>Floor Price</div>
                                                                                    <div>
                                                                                        {/* <img src={PUBLIC_URL('images/eth.png')} alt="crypto-logo" style={{ width: '10%', display: 'inline-block' }} /> */}
                                                                                        {collection.floor_price ?
                                                                                            <span>{collection.floor_price} Ⓝ</span>
                                                                                            : <span>0</span>}
                                                                                        {
                                                                                            nearPrice !== undefined && collection.floor_price && collection.floor_price != 0 ?
                                                                                                <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;&nbsp;~{parseFloat((collection.floor_price * nearPrice).toString().substring(0, 5))} USD</span>
                                                                                                : undefined
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardWithTitle>
                                                                        <div className="text-center" style={{ margin: '30px 0px' }}>
                                                                            {/* <TxtButton text="Buy now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} /> */}
                                                                        </div>
                                                                    </CardWithBordersAndBgColor>
                                                                </Link>
                                                            </div>
                                                        })}
                                                    </Box>
                                                </>
                                                :
                                                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', minHeight: '20vh' }}>
                                                    <Typography sx={{ color: theme.pallete.lightBlue }}>We could not find any results for the given phrase</Typography>
                                                </Box>
                                            }
                                        </TabPanel>
                                    </div>
                                </div>
                            </Box>
                        </Box>























                    </Box>
            }
        </section>
    )
}
