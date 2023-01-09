import React, { useEffect, useRef, useState } from "react";
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import './Home.css'
import TxtButton from '../../components/TxtButton';
import CardWithTitle from "../../components/CardWithTitle";
import CustomTitle from "../../components/CustomTitle";
import { collections } from './collection'
import { Link } from "react-router-dom";
import { COLLECTION_API } from "../../data/collection_api";
import LoadingComponent from "../../components/loading/LoadingComponent";
import { Box, Typography } from "@mui/material";
import { API_CONFIG } from "../../config";
import { useMemo } from "react";

let ranks = collections.slice(-4)

export default function Rankings() {
    const [loading, setLoading] = useState(true)
    const apiCall = useRef(undefined)
    const [collections, setCollections] = useState(undefined)
    const [err, setErr] = useState(undefined)
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
        getCollections()
        return () => {
            if (apiCall.current != undefined)
                apiCall.current.cancel()
        }
    }, [])
    const getCollections = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: "/cmd/col/load/",
                method: "post",
                body: {
                    from: 0,
                    to: 4
                }
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess) throw response
            setCollections(response.data)
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setErr('No Collections found')
            }
            else {
                setErr('Failed to load')
            }
            setLoading(false)
        }
    }
    return (
        <div className='container'>
            <CustomTitle variant='h1' isCenter={true} fontWeight='bold' text="Recent Bitzio collections" margin="50px 0px" />
            {loading ?
                <LoadingComponent
                    isGrid={true}
                    ColNumber={2}
                    responsiveColNumber={1}
                    elementType={"rounded"}
                    elementWidth={"100%"}
                    elementHeight="200px"
                    responsiveElementWidth="100%"
                    responsiveElementHeight="200px"
                    elementCount={4}
                    responsiveCount={2}
                />
                :
                err ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ color: 'red' }}>{err}</Typography>
                </Box>
                    :
                    <div className='row'>
                        {collections.map((collection, index) => {
                            return <div className='col-md-6' key={index}>
                                <Link to={`/collections/${collection._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                    <div style={{ position: 'relative', margin: '40px 0px' }}>
                                        <div style={{
                                            backgroundColor: '#3a3d4d',
                                            border: '2px solid #606370',
                                            borderRadius: '70px',
                                            height: '120px',
                                            width: '120px',
                                            position: 'absolute',
                                            top: '-60px',
                                            left: '50%',
                                            transform: 'translate(-50%,0)',
                                            zIndex: -1,
                                            boxShadow: '0px 0px 10px 1px rgba(0,0,0,0.7)'
                                        }}></div>
                                        <div style={{ backgroundColor: '#3a3d4d', border: '2px solid #606370', borderRadius: 15, zIndex: 99, boxShadow: '0px 0px 15px 2px rgba(0,0,0,0.7)' }}>
                                            <div className="row">
                                                <div className="col-4" >
                                                    {/* <div style={{ fontWeight: 'bold', margin: '20px auto', backgroundColor: '#04a5c3', border: '3px solid #61c6da', borderRadius: '10px', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{index + 1}</div> */}
                                                </div>
                                                <div className="col-4">
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '50%',
                                                        transform: 'translate(-50%,0)',
                                                        zIndex: 2,
                                                        backgroundColor: '#3a3d4d',
                                                        height: '118px',
                                                        width: '118px',
                                                        top: '-57px',
                                                        borderRadius: '65px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{
                                                            backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`)),
                                                            height: '100px',
                                                            width: '100px',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            borderRadius: '50px',
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', height: '100%' }}>
                                                <div>Changes</div>
                                                <div style={{ color: 'green' }}>{Math.floor(Math.random() * (index + 1) * 100 / ((index + 1) * 2))}%</div>
                                            </div> */}
                                                </div>
                                            </div>
                                            <CardWithTitle title={`${collection.title}`} width="90%" marginTop="80px" fontSize="16px" responsiveFontSize="12px">
                                                <div className="row text-center">
                                                    <div className="col-6">
                                                        <div style={{ margin: '5px' }}>Owners</div>
                                                        <div>{collection.nft_owners_count}</div>
                                                    </div>
                                                    {/* <div className="col-4">
                                                        <div style={{ margin: '5px' }}>Traded</div>
                                                        <div>{Math.floor(Math.random() * 200)}</div>
                                                    </div> */}
                                                    <div className="col-6">
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
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        })}
                    </div>
            }
            <div className="text-center">
                <Link to='/all-collections'>
                    <TxtButton text="See All Collections" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                </Link>
            </div>
        </div >
    )
}
