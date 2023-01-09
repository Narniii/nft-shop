import { Accordion, AccordionDetails, AccordionSummary, Box, Tabs, Typography, TextField, CircularProgress, useTheme } from "@mui/material";
import Tab from '@mui/material/Tab';
import CardWithBordersAndBgColor from "../../components/CardWithBordersAndBgColor";
import CardWithTitle from "../../components/CardWithTitle";
import TxtButton from "../../components/TxtButton";
import { BG_URL, PUBLIC_URL } from "../../utils/utils";
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collections } from "../home/collection";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ButtonWithLogo from '../../components/ButtonWithLogo'
import { useSelector } from "react-redux";
import { API_CONFIG } from "../../config";
import axios from "axios";
import { COLLECTION_API } from "../../data/collection_api";
import { AUTH_API } from "../../data/auth_api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../Collections/CollectionSingle/CollectionSingle.css'
import SocialRow from "../Collections/CollectionSingle/SocialRow";
import { useMemo } from "react";


const Creator = () => {
    const theme = useTheme()
    const userDetails = useSelector(state => state.userReducer)
    const [collectibles, setCollectibles] = React.useState(undefined)
    const [loading, setLoading] = React.useState(true)
    const [collections, setCollections] = React.useState(undefined)
    const [err, setErr] = useState(undefined)
    const apiCall = useRef(undefined)
    const genApi = useRef(undefined)
    const getUserApiCall = useRef(undefined)
    const [user, setUser] = useState(undefined)
    const [colErr, setColErr] = useState(undefined)
    const name = useParams().name;
    const [genCol, setGenCol] = useState(undefined)
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
    useEffect(() => {
        // fetchCollections()
        getUser()
        getCollections()
        getUserGenCols()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            if (getUserApiCall.current !== undefined)
                getUserApiCall.current.cancel();
            if (genApi.current !== undefined)
                genApi.current.cancel();
        }
    }, [])

    useEffect(() => {
        if (userDetails && userDetails.nftContract) {
            getCollectibles()
        }
    }, [userDetails])
    useEffect(() => {
        if (collections !== undefined && collectibles !== undefined && user !== undefined && genCol !== undefined) {
            setLoading(false)
        }
    }, [collections, genCol, collectibles, user])
    const getUser = async () => {
        try {
            getUserApiCall.current = AUTH_API.request({
                path: `/auth/user/get/`,
                method: "post",
                body: { "wallet_address": name, "id": "" },
            });
            let response = await getUserApiCall.current.promise;
            if (!response.isSuccess)
                throw response
            setUser(response.data)
        }
        catch (err) {
            setErr("Failed to load user.")
            setLoading(false)
        }
    }
    const getCollectibles = async () => {
        try {
            const res = await userDetails.nftContract.nft_tokens_for_owner({
                "account_id": name,
                // accountId: userDetails.nftContract.account.accountId,
            });
            console.log(res)
            setCollectibles(res)
        } catch (err) {
            setErr("Failed to load user collectibles. Try reloading the page.")
            setLoading(false)
            return
        }
    };
    const getCollections = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/user/`,
                method: "post",
                body: { wallet_address: name },
            });
            let response = await apiCall.current.promise;
            if (!response.isSuccess)
                throw response
            setCollections(response.data)
        }
        catch (err) {
            // setErr(err.toString())
            console.log(err)
            if (err.status == 404) {
                setCollections([])
                setColErr("No collections found")
                return
            }
            else {
                setErr("We're sorry , something is wrong with the server. Please try again later.")
                setLoading(false)
            }
        }
    }
    const getUserGenCols = async () => {
        try {
            genApi.current = COLLECTION_API.request({
                path: "/cmd/col/gen/creator/",
                method: 'post',
                body: { creator: name }
            })
            const response = await genApi.current.promise
            if (!response.isSuccess)
                throw response
            setGenCol(response.data)
        }
        catch (err) {
            if (err.status == 404) {
                setGenCol([])
                return
            }
            else setErr("Failed to load user collections")
        }
    }
    return (
        <>
            {loading ?
                <Box sx={{ minHeight: "40vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ color: theme.pallete.lightBlue }}>Loading...</Typography>
                </Box> :
                err ? <Typography sx={{ color: 'red', margin: '20px 10px' }}>{err}</Typography> :
                    <section>
                        {
                            user && user.banner_path ?
                                <div className='collection-banner' style={{ backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.banner_path}`) }}>
                                    <div className='collection-thumbnail'>
                                        {user && user.avatar_path ?
                                            <div className='collection-thumbnail-image' style={{
                                                backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.avatar_path}`),
                                            }}
                                            />
                                            :
                                            <AccountCircleIcon sx={{ color: '#00a6c5', fontSize: "124px" }} />
                                        }
                                    </div>
                                </div>
                                :
                                <div className='collection-banner' style={{ backgroundImage: BG_URL(PUBLIC_URL('images/banner.jpg')) }}>
                                    <div className='collection-thumbnail'>
                                        {user && user.avatar_path ?
                                            <div className='collection-thumbnail-image' style={{
                                                backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.avatar_path}`),
                                            }}
                                            />
                                            :
                                            <AccountCircleIcon sx={{ color: '#00a6c5', fontSize: "124px" }} />
                                        }
                                    </div>
                                </div>
                        }
                        <Typography variant='h1' sx={{ marginTop: 10, marginBottom: 1, textAlign: 'center', fontWeight: 'bold' }}>{name}</Typography>
                        <SocialRow links={user && user.extra ? user.extra : {}} />
                        {user && user.description !== undefined ?
                            <Typography variant='h5' sx={{ margin: 4, textAlign: 'center' }}>{user.description}</Typography>
                            :
                            undefined
                        }

                        <Box className="accardeon-wrapper" sx={{ width: '100%', color: 'white' }}>
                            <Box sx={{ width: { sm: '100%', md: '97%' }, margin: '0 auto' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} onChange={handleChange}>
                                        <Tab fontFamily='Spartan' sx={{ fontFamily: 'Spartan' }} label={<Box><Typography sx={{ margin: '1px 0px' }}>Collectibles</Typography> </Box>} />
                                        <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Collections</Typography> </Box>} />
                                        <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Generatives</Typography> </Box>} />
                                    </Tabs>
                                </Box>
                                <div className='row' style={{ margin: 0 }}>
                                    <div className='col-12'>
                                        <TabPanel value={value} index={0}>
                                            <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' } }}>
                                                <div className='row'>
                                                    {collectibles == undefined ? <CircularProgress /> :
                                                        collectibles.length != 0 ?
                                                            <>
                                                                {collectibles.map((collectible, index) => {
                                                                    return <div className="col-md-4" key={index}>
                                                                        <Link to={`/collections/${collectible.metadata.title}/assets/${collectible.token_id}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                                            <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                                                <Box sx={{
                                                                                    // backgroundImage: BG_URL(`${collectible.metadata.media}`),
                                                                                    // backgroundImage: BG_URL(PUBLIC_URL(`${collectible.metadata.media}`)),
                                                                                    backgroundImage: BG_URL(`${collectible.metadata.media}`),
                                                                                    height: { xs: '150px', sm: '300px' },
                                                                                    backgroundSize: 'cover',
                                                                                    backgroundPosition: 'center',
                                                                                    margin: '10px',
                                                                                    borderRadius: '15px',
                                                                                }} />
                                                                                <CardWithTitle title={`${collectible.metadata.title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                                                                    <div className="row">
                                                                                        {/* <div className="col-5">
                                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                                                                <span>{Math.floor(Math.random() * 100)}</span>
                                                                                            </div>
                                                                                        </div> */}
                                                                                        <div className="col-12 text-center">
                                                                                            <div>Floor Price</div>
                                                                                            <div>
                                                                                                {collectible.price ?
                                                                                                    <span>{collectible.price} Ⓝ</span>
                                                                                                    : <span>0</span>}
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
                                                            </>
                                                            :
                                                            <>
                                                                <Typography sx={{ margin: "50px 0px", textAlign: 'center', color: theme.pallete.lightBlue }}>No collectibles at the moment</Typography>
                                                            </>}
                                                </div>
                                            </Box>
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' } }}>
                                                <div className='row'>
                                                    {collections.length != 0 ?
                                                        <>
                                                            {collections.map((collection, index) => {
                                                                return <div className="col-md-4" key={index}>
                                                                    <Link to={`/collections/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                                        <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                                            <Box sx={{
                                                                                backgroundImage: BG_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`),
                                                                                // backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`)),
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
                                                                                                    <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;~{parseFloat((collection.floor_price * nearPrice).toString().substring(0, 5))} USD</span>
                                                                                                    : undefined
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardWithTitle>
                                                                            <div className="text-center" style={{ margin: '10px 0px' }}>
                                                                                {/* <TxtButton text="Buy now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} /> */}
                                                                            </div>
                                                                        </CardWithBordersAndBgColor>
                                                                    </Link>
                                                                </div>
                                                            })}
                                                        </>
                                                        :
                                                        <>
                                                            <Typography sx={{ margin: "50px 0px", textAlign: 'center', color: theme.pallete.lightBlue }}>No collections found.</Typography>
                                                        </>}
                                                </div>
                                            </Box>
                                        </TabPanel>
                                        <TabPanel value={value} index={2}>
                                            <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' } }}>
                                                <div className='row'>
                                                    {genCol.length != 0 ?
                                                        <>
                                                            {genCol.map((collection, index) => {
                                                                return <div className="col-md-4" key={index}>
                                                                    <Link to={`/collections/gen/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                                        <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                                            <Box sx={{
                                                                                backgroundImage: BG_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`),
                                                                                // backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`)),
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
                                                                                            {collection.reveal ?
                                                                                                <span>{collection.reveal[0].start_mint_price} Ⓝ</span>
                                                                                                : <span>0</span>}
                                                                                            {
                                                                                                nearPrice !== undefined && collection.reveal && collection.reveal[0] && collection.reveal[0].start_mint_price != 0 ?
                                                                                                    <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;~{parseFloat((collection.reveal[0].start_mint_price * nearPrice).toString().substring(0, 5))} USD</span>
                                                                                                    : undefined
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardWithTitle>
                                                                            <div className="text-center" style={{ margin: '10px 0px' }}>
                                                                                {/* <TxtButton text="Buy now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} /> */}
                                                                            </div>
                                                                        </CardWithBordersAndBgColor>
                                                                    </Link>
                                                                </div>
                                                            })}
                                                        </>
                                                        :
                                                        <>
                                                            <Typography sx={{ margin: "50px 0px", textAlign: 'center', color: theme.pallete.lightBlue }}>No collections found.</Typography>
                                                        </>}
                                                </div>
                                            </Box>
                                        </TabPanel>
                                    </div>
                                </div>
                            </Box>
                        </Box>
                    </section >
            }
        </>
    );
}

export default Creator;