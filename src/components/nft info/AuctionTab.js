import { BedroomChildSharp } from "@mui/icons-material"
import { Box, CircularProgress, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { COLLECTION_API } from "../../data/collection_api"

const AuctionTab = ({ nftId, auction }) => {
    const id = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [aucError, setAucError] = useState(false)
    // const [auction, setAuction] = useState(undefined)
    const [bids, setBids] = useState(undefined)
    const [highestBid, setHighestBid] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [count_down, setCount_down] = useState(undefined)
    const [highestBidder, setHighestBidder] = useState(undefined)
    const theInterval = useRef(null)
    const apiCall = useRef(undefined)
    const bidsApiCall = useRef(undefined)
    var this_time = new Date(Date.now())
    let [searchParams, setSearchParams] = useSearchParams();
    const errorCode = searchParams.get('errorCode')
    const status = searchParams.get('status')



    const CountDown = () => {
        var difference;
        var q;
        // console.log(startTime)
        // console.log(finishTime)
        if (startTime && finishTime)
            switch (true) {
                case (this_time < new Date(startTime)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(startTime).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to start"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to start"
                    break;
                case (new Date(startTime) < this_time && this_time < new Date(finishTime)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(finishTime).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to finish"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to finish"
                    break;
                case (new Date(finishTime) < this_time):
                    setCount_down(0)
                    q = " this auction is expired "
                    break;
                default:
                    break;
            }
        useEffect(() => {
            if (count_down != undefined) {
                return () => {
                    if (theInterval.current)
                        clearInterval(theInterval.current);
                };
            }
        }, [count_down])
        return (
            <>
                {/* {count_down_text.toString()} */}
                {count_down != undefined ? <p style={{ color: "orange" }}>{count_down}{q}</p> : <CircularProgress style={{ color: "white" }} />}
            </>
        )
    }


    // const testMemo = useMemo(() => CountDown(startTime, finishTime), [startTime, finishTime])


    // useEffect(() => {
    //     getActiveAuction()
    //     getActiveBids()
    //     return () => {
    //         if (apiCall.current !== undefined)
    //             apiCall.current.cancel();
    //         if (bidsApiCall.current !== undefined)
    //             bidsApiCall.current.cancel();
    //     }
    // }, [])

    useEffect(() => {
        if (errorCode && status && status == "create-auction")
            navigate(`/collections/${id.name}/assets/${id.id}/#action-tab`)
    }, [])

    useEffect(() => {
        if (bids != undefined && highestBid != undefined)
            for (var j = 0; j < bids.length; j++)
                if (bids[j].price == highestBid)
                    setHighestBidder(bids[j].from_wallet_address)
    }, [bids, highestBid])

    useEffect(() => {
        if (auction != undefined) {
            setStartTime(parseInt(auction.start_time))
            setFinishTime(parseInt(auction.start_time) + parseInt(auction.duration))
            setBids(auction.bids)
        }
    }, [auction])
    useEffect(() => {
        var pricesArray = []
        if (bids)
            for (var i = 0; i < bids.length; i++)
                pricesArray.push(bids[i].price)
        setHighestBid(Math.max(...pricesArray))
        setLoading(false)
    }, [bids])

    return (
        <Box sx={{ height: "400px", width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", }, }}>
            {loading ?
                <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px' }}>
                    <CircularProgress style={{ color: "white" }} />
                </Box>
                :
                <>
                    {auction.length !== 0 ?
                        <>
                            <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px', position: "relative" }}>
                                <CountDown />
                                {highestBidder ? <>
                                    <div style={{ display: "flex", fontSize: "12px", color: "lightgrey", position: "absolute", bottom: "1%", right: "1%" }}>
                                        <span>
                                            highest offer:
                                        </span>
                                        <Link style={{ textDecoration: "none", color: "whitesmoke", verticalAlign: "center", "&:hover": { textDecoration: "underline" } }} to={`/creator/${highestBidder}`}><div>{highestBidder}</div></Link>
                                        <span>
                                            &nbsp;
                                            for &nbsp;
                                            {highestBid}Ⓝ
                                        </span>
                                    </div>
                                </> : undefined}
                            </Box>
                            <Box sx={{ borderRadius: "50%", margin: "10px 0", backgroundColor: "white", height: "1px" }} />
                            {bids.length != 0 ?
                                <>
                                    {bids.map((bid, index) => {
                                        return <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px', position: "relative" }}>
                                            from &nbsp; {bid.from_wallet_address} &nbsp; for &nbsp; {bid.price}Ⓝ &nbsp; &nbsp; status:{bid.status}
                                        </Box>
                                    })}
                                </> : <>
                                    <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px', position: "relative" }}>
                                        no offers at the moment
                                    </Box>
                                </>}
                        </>
                        :
                        <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px', position: "relative" }}>
                            <Typography className="text-center">No active auction at the moment</Typography>
                        </Box>
                    }
                </>
            }
        </Box>
    );
}

export default AuctionTab;