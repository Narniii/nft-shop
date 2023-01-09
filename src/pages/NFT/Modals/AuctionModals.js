import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Modal, TextField, Typography, useTheme } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { InputOutlined } from "@mui/icons-material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { COLLECTION_API } from "../../../data/collection_api";
import TxtButton from "../../../components/TxtButton";
import { useSelector } from 'react-redux';
import { utils } from "near-api-js";



export const PlaceBidModal = ({ open, onClose, floor, auction, aucError, currentOwner }) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const transactionHashes = searchParams.get('transactionHashes')

    const id = useParams()
    const userDetails = useSelector(state => state.userReducer)
    const [apiLoading, setApiLoading] = useState(undefined)
    const [placed, setPlaced] = useState(false)
    const [highestBid, setHighestBid] = useState(undefined)
    const [price, setPrice] = useState(0)
    const [err, setErr] = useState(undefined)
    const [currentBid, setCurrentBid] = useState(undefined)
    const [bids, setBids] = useState(undefined)
    const apiCall = useRef(undefined)
    const bidsApiCall = useRef(undefined)
    const [isBidCanceled, setIsBidCanceled] = useState(false)
    const [cancelError, setCancelError] = useState(undefined)
    const navigate = useNavigate()
    const status = searchParams.get('status')
    const forPrice = searchParams.get('forPrice')
    const errorCode = searchParams.get('errorCode')


    const theme = useTheme()
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "40%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };
    useEffect(() => {
        // if (open)
        // getActiveBids()
        return () => {
            // if (bidsApiCall.current !== undefined)
            //     bidsApiCall.current.cancel();
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])








    // change and test the if & apicall later 

    // useEffect(() => {
    //     if (bids && bids.length != 0 && errorCode && status && status == "place-a-bid") {
    //         deleteBidIfCanceled()
    //     }
    // }, [])
    // const deleteBidIfCanceled = async () => {
    //     try {
    //         apiCall.current = COLLECTION_API.request({
    //             path: `//////////////////`,
    //             method: "post",
    //             body: {
    //                 nft_id: id.id,
    //             }
    //         });
    //         let response = await apiCall.current.promise;
    //         console.log(response)
    //         if (!response.isSuccess)
    //             throw response
    //     }
    //     catch (err) {
    //         console.log(err)
    //         setErr(err.statusText)
    //     }
    // }

    // change and test the if & apicall later 








    const handleSubmit = async (e) => {
        navigate(`/collections/${id.name}/assets/${id.id}?status=place-a-bid&forPrice=${price ? price : 0}`)

        console.log(userDetails)
        e.preventDefault()
        setApiLoading(true)
        setErr(undefined)
        if (price == undefined) {
            setErr("please select a price for your bid")
            setApiLoading(false)
            return
        }
        else if (price <= highestBid) {
            if (bids.length != 0) {
                setErr("your bid must be higher than the highest bid available")
            } else { setErr("your bid must be higher than or equal to the floor price") }
            setApiLoading(false)
            return
        }
        else {
            setErr(undefined)
        }
        try {
            const res = await userDetails.marketContract.add_bid({
                args: {
                    token_id: id.id,
                    nft_contract_id: userDetails.nftContract.contractId,
                    amount: utils.format.parseNearAmount(price),
                },
                accountId: userDetails.marketContract.account.accountId,
                amount: utils.format.parseNearAmount(price)
                // depositYocto: "1000000000000000000000000"
            });
            console.log(res)
            // setPlaced(true)
            // setApiLoading(false)
            // setCurrentBid(response.data)
        }
        catch (err) {
            console.log(err)
            setErr("please try again later")
            setApiLoading(false)
        }
    }

    const apiForPlacingBid = async () => {
        setApiLoading(true)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/add/bid/`,
                method: "post",
                body: {
                    nft_id: id.id,
                    auction_bid: [{ from_wallet_address: userDetails.userWallet, price: forPrice }]
                },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setPlaced(true)
            setApiLoading(false)
            setCurrentBid(response.data)
        }
        catch (err) {
            console.log(err)
            setErr("please try again later")
            setApiLoading(false)
        }
    }
    useEffect(() => {
        var pricesArray = []
        if (auction) {
            if (auction.length != 0) {
                setBids(auction.bids)
                if (auction.bids.length != 0) {
                    for (var i = 0; i < auction.bids.length; i++) {
                        pricesArray.push(auction.bids[i].price)
                        if (auction.bids[i].from_wallet_address == userDetails.userWallet)
                            setPlaced(true)
                    }
                    setHighestBid(Math.max(...pricesArray))
                } else {
                    setBids([])
                    setHighestBid((parseInt(auction.starting_price) - 1).toString())
                }
            } else {
                setHighestBid(undefined)
                setBids(undefined)
            }
        } else if (aucError) {
            setErr(aucError)
            setBids(undefined)
        } else setErr("something wrong , please try againg later")
    }, [])


    useEffect(() => {
        getMarketData()
    }, [])

    const getMarketData = async () => {
        try {
            const res = await userDetails.marketContract.get_market_data({
                "nft_contract_id": userDetails.nftContract.contractId,
                "token_id": id.id,
            });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    };

    const cancelBid = async (e) => {
        navigate(`/collections/${id.name}/assets/${id.id}?status=cancel-bid`)
        // try {
        const res = await userDetails.marketContract.cancel_bid({
            args: {
                token_id: id.id,
                nft_contract_id: userDetails.nftContract.contractId,
                account_id: userDetails.userWallet,
            },
            accountId: userDetails.marketContract.account.accountId,
            amount: "1"
            // depositYocto: "1000000000000000000000000"
        });
        console.log(res)
        // }
        // catch (err) {
        //     console.log(err)
        //     setCancelError("please try again later")
        //     setApiLoading(false)
        // }

    }
    const apiforCancelBid = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/cancel/bid/`,
                method: "post",
                body: {
                    nft_id: id.id,
                    wallet_address: userDetails.userWallet
                },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            console.log("last bid canceled")
            setPlaced(false)
            navigate(`/collections/${id.name}/assets/${id.id}`)
            // setLoading(false)
        }
        catch (err) {
            console.log(err)
            setCancelError("please try again later")
            setApiLoading(false)
        }
    }


    useEffect(() => {
        if (!open)
            return
        if (!status) {
            // setLoading(false)
            return
        }
        if (userDetails.userWallet.length < 5) {
            return
        }
        if (errorCode) {
            if (status && status == "place-a-bid") {
                setPlaced(false)
            }
        }
        else if (transactionHashes) {
            if (status && status == "place-a-bid") {
                apiForPlacingBid()
            }
            if (status && status == "cancel-bid") {
                apiforCancelBid()
            }
        }
        else {
            return
        }
    }, [open])

    // const getActiveBids = async () => {
    //     var pricesArray = []
    //     try {
    //         bidsApiCall.current = COLLECTION_API.request({
    //             path: `/cmd/nft/auc/active/bids/`,
    //             method: "post",
    //             body: { nft_id: id.id, }
    //         });
    //         let response = await bidsApiCall.current.promise;
    //         console.log(response)
    //         if (!response.isSuccess)
    //             throw response
    //         setBids(response.data)
    //         for (var i = 0; i < response.data.length; i++) {
    //             pricesArray.push(response.data[i].price)
    //             if (response.data[i].from_wallet_address == userDetails.userWallet)
    //                 setPlaced(true)
    //         }
    //         setHighestBid(Math.max(...pricesArray))
    //     }
    //     catch (err) {
    //         console.log(err)
    //         if (err.status == 404) {
    //             setBids([])
    //             if (floor != undefined)
    //                 setHighestBid(floor)
    //         }
    //         else {
    //             setBids(undefined)
    //             setErr(err.statusText)
    //         }
    //     }
    // }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Place A Bid</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    <Box sx={{ color: 'white', marginTop: '20px' }}>
                        <Typography sx={{ margin: "10px 0px" }}>offer price</Typography>
                        <input name="offer price"
                            style={{ width: "280px" }}
                            //  value={collection.category} onKeyDown={onChange} onChange={onChange}
                            type="number" className="form-control" placeholder={bids ? bids.length == 0 ? (parseInt(highestBid) + 1).toString() : highestBid : highestBid}
                            onChange={(e) => { setPrice(e.target.value) }}
                        />
                    </Box>
                    <div className="text-center" style={{ margin: "10px 0px" }}>
                        {placed ? (
                            <>
                                {err ? <Typography className="text-center" sx={{ color: "red", fontSize: "11px" }}>{err}</Typography> :
                                    <>
                                        <Typography variant="h4" sx={{ color: "gray", margin: "20px 0px", fontWeight: 'bold' }}>
                                            you placed a bid on this auction
                                        </Typography>
                                        {
                                            transactionHashes ?
                                                <>
                                                    < Box sx={{ padding: "20px", margin: "50px" }}>
                                                        <Typography sx={{ color: theme.pallete.lightBlue }}>transaction hash:</Typography>
                                                        <Typography> {transactionHashes}</Typography>
                                                    </Box>
                                                </>
                                                : undefined}
                                    </>
                                }
                                {apiLoading ?
                                    <>
                                        <TxtButton
                                            text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            width='95%' />
                                    </>
                                    :
                                    <>
                                        <TxtButton
                                            text={`place a higher bid ?`}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            width="95%"
                                            onClick={handleSubmit}
                                        />
                                        {/* {err ? <Typography className="text-center" sx={{ color: "red", fontSize: "11px" }}>{err}</Typography> : undefined} */}
                                    </>
                                }
                                {isBidCanceled ?
                                    <>
                                        <TxtButton
                                            text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                            bgColor="linear-gradient(180deg, rgb(153, 33, 27 , 1) 0%, rgb(153, 33, 27 , 0) 100%)"
                                            borderColor="rgb(153, 33, 27)"
                                            width='30%' />
                                    </>
                                    :
                                    <>
                                        <TxtButton
                                            text={`cancel your last bid ?`}
                                            bgColor="linear-gradient(180deg, rgb(153, 33, 27 , 1) 0%, rgb(153, 33, 27 , 0) 100%)"
                                            borderColor="rgb(153, 33, 27)"
                                            fontSize="12px"
                                            width="30%"
                                            onClick={cancelBid}
                                        />
                                        {cancelError ? <Typography className="text-center" sx={{ color: "red", fontSize: "11px" }}>{cancelError}</Typography> : undefined}
                                    </>
                                }
                            </>
                        ) :
                            <>
                                {apiLoading ?
                                    <>
                                        <TxtButton
                                            text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            width='95%' />
                                    </>
                                    :
                                    <>
                                        <TxtButton
                                            text={`place`}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            width="95%"
                                            onClick={handleSubmit}
                                        />
                                        {err ? <Typography className="text-center" sx={{ color: "red", fontSize: "11px" }}>{err}</Typography> : undefined}
                                    </>
                                }
                            </>
                        }
                    </div>
                </Box>
            </Box >
        </Modal >
    );
}




export const StartAuctionModal = ({ open, onClose, auction, aucError, currentOwner }) => {
    const id = useParams()
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [count_down, setCount_down] = useState(undefined)
    const [price, setPrice] = useState(0)
    const [err, setErr] = useState(undefined)
    const [apiLoading, setApiLoading] = useState(false)
    const theInterval = useRef(null)
    const apiCall = useRef(undefined)
    const userDetails = useSelector(state => state.userReducer)
    let [searchParams, setSearchParams] = useSearchParams();
    const transactionHashes = searchParams.get('transactionHashes')
    const errorCode = searchParams.get('errorCode')
    const finish = searchParams.get('finish')
    const start = searchParams.get('start')
    const forPrice = searchParams.get('forPrice')
    const status = searchParams.get('status')
    const [balance, setBalance] = useState(0.01)
    const [loading, setLoading] = useState(true)
    const amountInYocto = utils.format.parseNearAmount("0.01");
    const [started, setStarted] = useState(false)

    const navigate = useNavigate()
    var amountInNEAR;
    useEffect(() => {
        // getBalance()
    }, [])
    const getBalance = async () => {
        try {
            const res = await userDetails.marketContract.storage_balance_of({
                "account_id": userDetails.marketContract.account.accountId,
                accountId: userDetails.marketContract.account.accountId,
            });
            console.log(res)
            setBalance(res)
        } catch (err) {
            console.log(err)
        }
    };
    useEffect(() => {
        if (balance != undefined) {
            amountInNEAR = utils.format.formatNearAmount(balance);
            setLoading(false)
            console.log(balance)
            console.log(typeof (balance))
            console.log(amountInNEAR)
        }
    }, [balance])

    var this_time = new Date(Date.now())
    // setStartTime(this_time)

    useEffect(() => {
        if (auction && auction.length != 0 && errorCode && userDetails.userWallet == currentOwner && currentOwner && status && status == "create-auction") {
            deleteAucIfCanceled()
        }
    }, [])

    const deleteAucIfCanceled = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/del/`,
                method: "post",
                body: {
                    nft_id: id.id,
                }
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setStarted(false)
            auction = []
        }
        catch (err) {
            console.log(err)
            setErr(err.statusText)
        }
    }


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
        else setCount_down("time")
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
                {count_down != undefined ? <p style={{ color: "gray" }}>{count_down}{q}</p> : undefined}
            </>
        )
    }
    const theme = useTheme()
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "40%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };
    console.log(started)
    useEffect(() => {
        if (auction != undefined) {
            if (auction.length !== 0) {
                setStartTime(parseInt(auction.start_time))
                setFinishTime(parseInt(auction.start_time) + parseInt(auction.duration))
                setStarted(true)

            } else {
                setStarted(false)
            }
        } else if (aucError) {
            setErr(aucError)
        } else setErr("something wrong , please try againg later")

        if (transactionHashes && status && status == "create-auction")
            setStarted(true)

        // if (open)
        // getActiveAuction()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiLoading(true)
        setErr(undefined)
        if (finishTime == undefined) {
            setErr('please select an expire time for your auction.')
            setApiLoading(false)
            return
        }
        else if (this_time > new Date(finishTime)) {
            setErr('Please select a none expired date for you auction.')
            setApiLoading(false)
            return
        }
        // else if (new Date(startTime) > new Date(finishTime)) {
        //     setErr('start time cannot be larger than finish time.')
        //     setApiLoading(false)
        //     return
        // }
        // if (startTime == undefined) {
        //     setErr('please select a start time for your auction.')
        //     setApiLoading(false)
        //     return
        // }
        // else
        else {
            setErr(undefined)
            navigate(`/collections/${id.name}/assets/${id.id}?status=create-auction&finish=${finishTime.getTime()}&start=${this_time.getTime()}&forPrice=${price ? price : 0}`)
        }
        // const formData = new FormData();
        // formData.append('nft_id', id.id);
        // formData.append('auction', JSON.stringify({ is_ended: false, start_time: this_time.getTime(), duration: finishTime.getTime() - this_time.getTime(), starting_price: price, reserve_price: 0, include_reserve_price: false }))
        // console.log(typeof(price))
        try {
            var tt = this_time.getTime()
            var _start = parseInt(tt)
            var hh = finishTime.getTime()
            var _finish = parseInt(hh)
            var pp = utils.format.parseNearAmount(price)
            console.log(_finish * 1000000)
            const res = await userDetails.nftContract.nft_approve({
                args: {
                    token_id: id.id,
                    account_id: userDetails.marketContract.contractId,
                    msg: JSON.stringify({
                        market_type: "sale",
                        price: pp,
                        // started_at: startTime ? _start * 1000000 : 0,
                        ended_at: finishTime ? (_finish * 1000000).toString() : 0,
                        is_auction: true,
                    }),
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: amountInYocto,
                gas: "300000000000000"
                // depositYocto: "1000000000000000000000000"
            });
            console.log(res)
        }
        catch (err) {
            console.log(err)
            setErr(err)
        }
    }

    useEffect(() => {
        if (!open)
            return
        if (!status) {
            setLoading(false)
            return
        }
        if (userDetails.userWallet.length < 5) {
            return
        }
        if (errorCode) {
            if (status && status == "create-auction") {
                setStarted(false)
                setLoading(false)
            }
        }
        else if (transactionHashes) {
            if (status && status == "create-auction") {
                apiForStartAuction()
                if (start && finish) {
                    setStartTime(parseInt(start))
                    setFinishTime(parseInt(finish))
                }
            }
        }
        else {
            return
        }
    }, [open])

    const apiForStartAuction = async () => {
        // e.preventDefault()
        setApiLoading(true)
        setErr(undefined)
        try {
            var tt = start
            var _start = parseInt(tt)
            var hh = finish
            var _finish = parseInt(hh)
            var pp = utils.format.parseNearAmount(price)
            console.log(_finish - _start)
            console.log(_finish - _start)
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/`,
                method: "post",
                body: {
                    nft_id: id.id,
                    auction: [
                        {
                            is_ended: false,
                            start_time: tt.toString(),
                            duration: (_finish - _start).toString(),
                            starting_price: forPrice,
                            reserve_price: "0",
                            include_reserve_price: false
                        },
                    ]
                }
                // body: JSON.stringify({nft_id:id.id , auction:}),
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setStarted(true)
            setApiLoading(false)
        } catch (err) {
            setStarted(false)
            console.log(err)
            setErr(err.statusText)
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Start An Auction</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    {started ? (
                        <div className="text-center" style={{ margin: "10px 0px" }}>
                            {transactionHashes ?
                                <Box sx={{ padding: "20px", margin: "50px" }}>
                                    <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                                        auction created successfully
                                    </Typography>
                                    <Typography sx={{ color: theme.pallete.lightBlue }}>transaction hash:</Typography>
                                    <Typography> {transactionHashes}</Typography>
                                </Box> : undefined}
                            <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                                auction is set
                            </Typography>
                            <CountDown />
                        </div>
                    ) :
                        <>
                            {loading ? <CircularProgress style={{ margin: "0 auto", color: "white", fontSize: "10px" }} /> : <>
                                {balance >= 0.01 ?
                                    <>
                                        <div className='create-col-reveal-wrapper'>
                                            {/* <Box sx={{ color: 'white', marginTop: '20px' }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DateTimePicker label="start time" value={startTime} onChange={(value, event) => { setStartTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                                </LocalizationProvider>
                                            </Box> */}
                                            <Box sx={{ color: 'white', marginTop: '20px' }}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DateTimePicker label="expire time" value={finishTime} onChange={(value, event) => { setFinishTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                                </LocalizationProvider>
                                            </Box>
                                        </div>
                                        <Box sx={{ color: 'white', marginTop: '20px' }}>
                                            <Typography sx={{ margin: "10px 0px" }}>Floor Price:</Typography>
                                            <input name="floor price"
                                                style={{ width: "280px" }}
                                                //  value={collection.category} onKeyDown={onChange} onChange={onChange}
                                                type="number" className="form-control" placeholder={price}
                                                onChange={(e) => { setPrice(e.target.value) }}
                                            />
                                        </Box>
                                        <div className="text-center" style={{ margin: "10px 0px" }}>
                                            {apiLoading ?
                                                <TxtButton
                                                    text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)"
                                                    width='190px' />
                                                :

                                                <TxtButton
                                                    text={`start`}
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)"
                                                    fontSize="12px"
                                                    width="95%"
                                                    onClick={handleSubmit}
                                                />}
                                            {err ?
                                                <Typography sx={{ fontSize: "11px", color: "red" }}>{err}</Typography>
                                                :
                                                undefined}
                                        </div>
                                    </> : <Box>
                                        There's no enough storage in your wallet , you can deposit <Link to='/storage-deposit'>here</Link>
                                    </Box>
                                }
                            </>
                            }
                        </>
                    }
                </Box>
            </Box>
        </Modal>
    );
}

