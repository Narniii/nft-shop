import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import FaceIcon from '@mui/icons-material/Face';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CardWithBordersAndBgColor from '../../../components/CardWithBordersAndBgColor';
import { BG_URL, PUBLIC_URL } from '../../../utils/utils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TxtButton from '../../../components/TxtButton';
import CardWithTitle from '../../../components/CardWithTitle';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import { COLLECTION_API } from '../../../data/collection_api';
export default function MyCollections() {
    const [fetchedCollections, setFetchedCollections] = useState([])
    const [loading, setLoading] = useState(true)
    const userDetails = useSelector(state => state.userReducer)
    const [err, setErr] = useState(undefined)
    const apiCall = useRef(undefined)
    useEffect(() => {
        if (userDetails.userId)
            fetchCollections()
    }, [userDetails])
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])
    const fetchCollections = async () => {
        const formData = new FormData();
        formData.append("user_id", userDetails.userId)
        formData.append("wallet_address", userDetails.userWallet)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/user/`,
                method: "post",
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setFetchedCollections(response.data)
            setLoading(false)
        }
        // catch (err) {
        //     console.log(err)
        //     if (err.response.data.message === "No Collection Found") {
        //         setFetchedCollections([])
        //         setErr(err.response.data.message)
        //         setLoading(false)

        //     }
        //     else setErr(err)
        // }
        catch (err) {
            setLoading(false)
            console.log(err)
            if (err.status == 500)
                setErr("Internal Server Error")
            else if (err.status == 404 && err.data.message == "No Collection Found") {
                setFetchedCollections([])
            }
            else setErr("Couldn't load the collections")
        }
    }
    return (
        <Box sx={{ minHeight: '70vh' }}>
            <Box className="container">
                {/* user typo */}
                <Box sx={{ padding: '10px 0px', justifyContent: 'center', alignItems: 'center', width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <FaceIcon sx={{ fontSize: 150 }} />
                    <Typography variant='h3' sx={{ fontWeight: 'bold' }}>{userDetails.userWallet} collections</Typography>
                </Box>
                {/* collections wrapper */}
                {loading ? <div className='text-center'><CircularProgress /> </div> :
                    err ? <Typography className='text-center' sx={{ color: 'red', fontWeight: 'bold', margin: '10px 0px' }} variant="h4">{err}</Typography> :
                        <Box className='row'>
                            {
                                fetchedCollections.length == 0 ?
                                    <Typography className="text-center" sx={{ color: '#00a6c5', fontWeight: 'bold', margin: '10px 0px' }} variant="h5">No collections found</Typography>
                                    :
                                    <>
                                        <Typography className="text-center" sx={{ margin: '10px 0px' }}>{fetchedCollections.length} collections</Typography>
                                        {fetchedCollections.map((collection) => {
                                            return <Box className='col-md-4' key={collection._id.$oid}>
                                                <Link to={`/collections/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                    <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                                        <Box sx={{
                                                            backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`)),
                                                            height: { xs: '150px', sm: '300px' },
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            margin: '10px',
                                                            borderRadius: '15px',
                                                        }} />
                                                        <CardWithTitle title={collection.title} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                                            <div className="row">
                                                                <div className="col-5">
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                                        <span>{Math.floor(Math.random() * 100)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div>Floor Price</div>
                                                                    <div>
                                                                        {/* <img src={PUBLIC_URL('images/eth.png')} alt="crypto-logo" style={{ width: '10%', display: 'inline-block' }} /> */}
                                                                        {collection.floor_price ?
                                                                            <span>{collection.floor_price} Ⓝ</span>
                                                                            : <span>0</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardWithTitle>
                                                        {/* <div className="text-center" style={{ margin: '10px 0px' }}>
                                                <TxtButton text="Buy now" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                                            </div> */}
                                                    </CardWithBordersAndBgColor>
                                                </Link>
                                            </Box>
                                        })
                                        }
                                    </>
                            }
                        </Box>
                }
            </Box>
        </Box>
    )
}
