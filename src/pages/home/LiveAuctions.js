import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useRef, useState, useMemo } from "react";
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
import CountDown from "../../components/CountDown";
import LiveAuctionCard from "../../components/LiveAuctionCard";



const LiveAuctions = () => {
    const apiCall = useRef(undefined)
    const [auctions, setAuctions] = useState(undefined)
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
        if (auctions === undefined)
            fetchAuctions()
        return () => {
            if (apiCall.current != undefined)
                apiCall.current.cancel();

        }
    }, [])
    const fetchAuctions = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/active/all/`,
                method: "get",
            })
            const response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setAuctions(response.data)
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setAuctions([])
            }
            else {
                setErr("Internal server error")
            }
            setLoading(false)
        }
    }
    return (
        <div className="container">
            <Typography sx={{ textAlign: 'center', margin: '20px 0px', fontWeight: 'bold' }} variant="h2">Live Auctions</Typography>
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
                        {auctions.length == 0 ?
                            <Typography sx={{ color: 'red', textAlign: 'center' }}>No auction found.</Typography>
                            :
                            auctions.length < 3 ?
                                <CustomSlider slidesCount={auctions.length}>
                                    {auctions.map((auction) => {
                                        return <div key={auction.nft_id}>
                                            <LiveAuctionCard auctions={auctions} nft={auction} />
                                        </div>
                                    })}
                                </CustomSlider>
                                :
                                <CustomSlider>
                                    {auctions.map((auction) => {
                                        return <div key={auction.nft_id}>
                                            <LiveAuctionCard auctions={auctions} nft={auction} />
                                        </div>
                                    })}
                                </CustomSlider>
                        }
                    </>
            }
        </div >);
}

export default LiveAuctions;