import { CircularProgress, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BG_URL, PUBLIC_URL } from '../../../utils/utils'
import './CollectionSingle.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import TxtButton from '../../../components/TxtButton'
import InfoCards from './InfoCards'
import { API_CONFIG } from '../../../config'
import NftTab from './NftTab'
import EventsTab from './EventsTab'
import { COLLECTION_API } from '../../../data/collection_api'
import SocialRow from './SocialRow'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import Proposals from './ProposalsTab'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

export default function GenCollectionSingle() {
    const userDetails = useSelector(state => state.userReducer)
    const apiCall = useRef(undefined)
    const nftsApiCall = useRef(undefined)
    const navigate = useNavigate()
    const id = useParams()
    const theme = useTheme()
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    const [NFTs, setNFTs] = useState(undefined)
    const [collection, setCollection] = React.useState(undefined)
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState(undefined)
    const [nftErr, setNftErr] = useState(undefined)
    const [NFTsLoading, setNFTsLoading] = useState(true)
    const [owners, setOwners] = useState(0)
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
    const this_time = parseInt(new Date(Date.now()).getTime())

    useEffect(() => {
        // getNFTs()
        getCollection()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            if (nftsApiCall.current !== undefined)
                nftsApiCall.current.cancel();
        }
    }, [])
    // const tempNft = {
    //     title: "??",
    //     description: "???",
    //     likes: [],
    //     price: "0",
    //     _id: {
    //         $oid: response.data.nft_ids[i]
    //     }
    // }
    const getCollection = async () => {
        var temp = []
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/get/`,
                method: "post",
                body: { collection_id: id.id },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setCollection(response.data)
            setOwners(response.data.nft_owners_count)
            setLoading(false)
            if (response.data.reveal[0].is_revealed == true) {
                let minteds = await getMintedNFTs()
                if (minteds == "err") setNftErr("Failed to load NFTs.")
                else setNFTs(minteds)
            }
            else {
                for (var i = 0; i < response.data.nft_ids.length; i++) {
                    temp.push({
                        title: "??",
                        description: "???",
                        likes: [],
                        price: response.data.reveal[0].start_mint_price,
                        _id: {
                            $oid: response.data.nft_ids[i]
                        },
                        media: response.data.reveal[0].reveal_link
                    })
                    console.log(temp)
                }
                setNFTs(temp)
            }
        }
        catch (err) {
            if (err.status == 404) {
                setErrMsg("No such collection found.")
            }
            else {
                setErrMsg("We're sorry , something is wrong with the server. Please try again later. Will be fixed asap")
            }

        }
    }

    useEffect(() => {
        if (NFTs != undefined)
            setNFTsLoading(false)
    }, [NFTs])


    const getMintedNFTs = async () => {
        try {
            nftsApiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/get/mint/`,
                method: "post",
                body: { collection_id: id.id },
            });
            let response = await nftsApiCall.current.promise;
            if (!response.isSuccess)
                throw response
            return response.data
        }
        catch (err) {
            console.log(err)
            return "err"
        }
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
        <>
            {errMsg ? <Box sx={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p style={{ color: "orange", marginTop: "40px" }}>{errMsg}</p></Box> :
                <section>
                    {loading ?
                        <Box sx={{ minHeight: "40vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ color: theme.pallete.lightBlue }}>Loading...</Typography>
                        </Box>
                        :
                        <>
                            <div className='collection-banner' style={{ backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`)) }}>
                                <div className='collection-thumbnail'>
                                    <div className='collection-thumbnail-image' style={{ backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`)) }} ></div>

                                </div>
                            </div>
                            <Typography variant='h1' sx={{ marginTop: 10, marginBottom: 5, textAlign: 'center', fontWeight: 'bold' }}>{collection.title}</Typography>
                            <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: 5 }}>Created by <Link to={`/creator/${collection.creator}`} style={{ textDecoration: 'none' }}>{collection.creator}</Link></Typography>
                            <SocialRow links={collection.extra} />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, justifyContent: 'space-evenly', width: { xs: '90%', sm: '95%', md: '70%' }, margin: '0 auto' }}>
                                <InfoCards title="items" content={collection.nft_ids.length} />
                                <InfoCards title="owners" content={collection.nft_owners_count} />
                                <InfoCards title="Floor price" content={`${collection.reveal[0].start_mint_price} Ⓝ`} />
                                {/* <InfoCards title="Traded" content={Math.floor(Math.random() * 100)} /> */}
                            </Box>
                            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: { xs: '20px auto', md: '80px auto' } }}>
                                <Typography component="div" sx={{
                                    width: 'fit-content',
                                    fontSize: { xs: '14px', md: '16px' },
                                    textAlign: 'justify',
                                    textJustify: "distribute",
                                    hyphens: 'auto',
                                    wordSpacing: '-0.05em'
                                }}>
                                    {collection.description}
                                </Typography>
                            </Box>
                            {
                                userDetails && userDetails.userWallet && userDetails.userWallet == collection.creator ?
                                    <Box sx={{ width: { xs: '100%', md: '80%', lg: '70%' }, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '10vh auto' }}>
                                        {/* <TxtButton
                                            margin="0px 10px"
                                            text="Create NFT"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            onClick={() => navigate("/create/nft")}
                                        /> */}
                                        <TxtButton
                                            margin="0px 10px"
                                            text="Create Event"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            onClick={() => navigate("/create/event")}
                                        />
                                        <TxtButton
                                            margin="0px 10px"
                                            text="Create Proposal"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            onClick={() => navigate("/create/proposal")}
                                        />
                                    </Box>
                                    : undefined
                            }
                            {
                                userDetails.userWallet == collection.creator && parseInt(collection.nft_mint[0].stop_mint) > this_time ?
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <TxtButton
                                            text="Reveal now"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            onClick={() => alert("we can reveal before minting time expiration with this(coming soon)")}
                                            fontSize="12px"
                                            width="40%"
                                        />
                                    </Box>
                                    :
                                    undefined
                            }

                            <div className='accardeon-wrapper'>
                                <Box sx={{ width: '100%', color: 'white' }}>
                                    <Box sx={{ width: { sm: '100%', md: '97%' }, margin: '0 auto' }}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <Tabs value={value} fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} onChange={handleChange}>
                                                <Tab fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} label={<Box ><CategoryOutlinedIcon sx={{ fontSize: { xs: 20, md: 30 } }} /> <Typography sx={{ margin: '1px 0px' }}>Items</Typography> </Box>} />
                                                {/* <Tab label={<Box><ShowChartOutlinedIcon sx={{ fontSize: { xs: 20, md: 30 } }} /> <Typography sx={{ margin: '1px 0px' }}>Activity</Typography> </Box>} /> */}
                                                <Tab label={<Box><EventOutlinedIcon sx={{ fontSize: { xs: 20, md: 30 } }} /> <Typography sx={{ margin: '1px 0px' }}>Events</Typography> </Box>} />
                                                <Tab label={<Box><ThumbsUpDownIcon sx={{ fontSize: { xs: 20, md: 30 } }} /> <Typography sx={{ margin: '1px 0px' }}>Proposals</Typography> </Box>} />
                                                {/* <Tab label={<Box><HandshakeOutlinedIcon sx={{ fontSize: { xs: 20, md: 30 } }} /> <Typography sx={{ margin: '1px 0px' }}>Collaborate</Typography> </Box>} /> */}
                                            </Tabs>
                                        </Box>

                                        <div className='row' style={{ margin: 0 }}>

                                            <div className='col-md-12'>
                                                <TabPanel value={value} index={0}>
                                                    <NftTab collection={collection} NFTs={NFTs} loading={NFTsLoading} err={nftErr} />
                                                </TabPanel>
                                                <TabPanel value={value} index={1}>
                                                    <EventsTab collection={collection} NFTs={NFTs} />
                                                </TabPanel>
                                                <TabPanel value={value} index={2}>
                                                    <Proposals collection={collection} NFTs={NFTs} />
                                                </TabPanel>
                                            </div>
                                        </div>
                                    </Box>
                                </Box>
                            </div>
                        </>
                    }
                </section >
            }
        </>
    )
}
