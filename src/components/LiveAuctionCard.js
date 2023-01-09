import { Box, CircularProgress } from "@mui/material";
import { useRef } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_CONFIG } from "../config";
import { COLLECTION_API } from "../data/collection_api";
import CardWithBordersAndBgColor from "./CardWithBordersAndBgColor";
import CardWithTitle from "./CardWithTitle";
import CountDown from "./CountDown";

const LiveAuctionCard = ({ auctions, nft }) => {
    const [nearUSDT, setNearUSDT] = useState(undefined)
    const [thisNFT, setThisNFT] = useState(undefined)
    const [errMsg, setErrMsg] = useState(undefined)
    const apiCall = useRef(undefined)

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
    const getNFT = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/get/`,
                method: "post",
                body: { nft_id: nft.nft_id },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setThisNFT(response.data)
        }
        catch (err) {
            if (err.status == 404) {
                setErrMsg("No such nft found.")
            }
            else {
                setErrMsg("We're sorry , something is wrong with the server. Please try again later. Will be fixed asap")
            }

        }
    }
    useEffect(() => {
        getNFT()
        return () => {
            if (apiCall.current != undefined)
                apiCall.current.cancel();
        }
    }, [])
    return (
        <>
            {thisNFT ?
                <Link to={`/collections/${thisNFT[0].collection_title}/assets/${thisNFT[1]._id.$oid}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                    <CardWithBordersAndBgColor
                        boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)"
                        width={
                            auctions.length == 1 ? { xs: "90%", sm: "40%" } : 'inherit'
                        }>
                        <Box sx={{
                            backgroundImage: `url(${thisNFT[1].media})`,
                            height: { xs: '150px', sm: '300px' },
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            margin: '10px',
                            borderRadius: '15px',
                        }} />
                        <CardWithTitle title={`${thisNFT[1].title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <div>Floor Price</div>
                                    <div>
                                        {nft.data[0].starting_price ?
                                            <span>{nft.data[0].starting_price} Ⓝ</span>
                                            : <span>0</span>}

                                        {
                                            nearPrice !== undefined ?
                                                <span style={{ fontSize: '12px', color: 'grey' }}>&nbsp;&nbsp;~{parseFloat((nft.data[0].starting_price * nearPrice).toString().substring(0, 5))} USD</span>
                                                : undefined
                                        }
                                    </div>
                                </div>
                            </div>
                        </CardWithTitle>
                        <div className="text-center" style={{ margin: '30px 0px' }}>
                            <CountDown startTime={nft.data[0].start_time} finishTime={parseInt(nft.data[0].start_time) + parseInt(nft.data[0].duration)} />
                        </div>
                    </CardWithBordersAndBgColor>
                </Link>
                : <CircularProgress style={{ color: "white" }} />}
        </>
    );
}

export default LiveAuctionCard;