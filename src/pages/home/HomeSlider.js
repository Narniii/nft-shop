import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import './Home.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TxtButton from '../../components/TxtButton';
import CustomSlider from "../../components/CustomSlider";
import CardWithBordersAndBgColor from "../../components/CardWithBordersAndBgColor";
import CardWithTitle from "../../components/CardWithTitle";
import { Link } from "react-router-dom";
import { COLLECTION_API } from "../../data/collection_api";
import { API_CONFIG } from "../../config";
import Skeleton from '@mui/material/Skeleton';
import LoadingComponent from "../../components/loading/LoadingComponent";
import { useMemo } from "react";

export default function HomeSlider() {
    const apiCall = useRef(undefined)
    const [collections, setCollections] = useState([])
    const [err, setErr] = useState(undefined)
    const [loading, setLoading] = useState(true)
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
    useEffect(() => {
        fetchCollections()
        return () => {
            if (apiCall.current != undefined)
                apiCall.current.cancel();

        }
    }, [])

    const fetchCollections = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/all/`,
                method: "get",
            })
            const response = await apiCall.current.promise;
            if (!response.isSuccess)
                throw response
            setCollections(response.data)
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            if (err.data.message == "No NFT Collection Found") {
                setCollections([])
            }
            else {
                setErr("Internal server error")
            }
            setLoading(false)
        }
    }
    return (
        <div className="container">
            <Typography sx={{ textAlign: 'center', margin: '20px 0px', fontWeight: 'bold' }} variant="h2">Collections</Typography>
            {loading ?
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
                :
                err ? <Typography sx={{ textAlign: 'center', margin: '20px 0px', fontWeight: 'bold', color: 'red' }} variant="h2">{err}</Typography> :
                    <>
                        {collections.length == 0 ?
                            <Typography sx={{ color: 'red', textAlign: 'center' }}>No collection found.</Typography>
                            :
                            collections.length < 3 ?
                                <CustomSlider slidesCount={collections.length}>
                                    {collections.map((collection) => {
                                        return <div key={collection._id.$oid}>
                                            <Link to={`/collections/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                                <CardWithBordersAndBgColor
                                                    boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)"
                                                    width={
                                                        collections.length == 1 ? { xs: "90%", sm: "40%" } : 'inherit'
                                                    }>
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
                                </CustomSlider>
                                :
                                <CustomSlider>
                                    {collections.map((collection) => {
                                        return <div key={collection._id.$oid}>
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
                                </CustomSlider>
                        }
                        <div className="text-center" style={{ margin: '40px 0px' }}>
                            <Link to='/all-collections'>
                                <TxtButton text="See All Collections" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                            </Link>
                        </div>

                    </>
            }
        </div >
    );

}