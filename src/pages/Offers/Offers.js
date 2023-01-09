import { Box, Card, CardMedia, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { AUTH_API } from '../../data/auth_api'
import { useSelector } from 'react-redux';
import { BG_URL, PUBLIC_URL } from '../../utils/utils';
import CardWithTitle from "../../components/CardWithTitle"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import RejectModal from './RejectModal';
import AcceptModal from './AcceptModal';
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams } from 'react-router-dom';

export default function Offers() {
    const theme = useTheme()
    const userDetails = useSelector(state => state.userReducer)
    const apiCall = useRef(undefined)
    const [err, setErr] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const [offerToChange, setOfferToChange] = useState(undefined)

    const [acceptModal, setAcceptModal] = useState(false)
    const [accepted, setAccepted] = useState(undefined)

    const [declinedModal, setDeclinedModal] = useState(undefined)
    const [declined, setDeclined] = useState(undefined)

    const [sentRequests, setSentRequests] = useState(undefined)
    const [receivedRequests, setReceivedRequests] = useState(undefined)
    const [isOperationDone, setIsOperationDone] = useState(undefined)
    
    let [searchParams, setSearchParams] = useSearchParams(); 
    const urlStatus = searchParams.get('status')
    const transactionHashes = searchParams.get('transactionHashes')
    const errorCode = searchParams.get('errorCode')
    const errorMessage = searchParams.get('errorMessage')

    const handleOperationChange = (value) => {
        setIsOperationDone(value)
    }
    const handleClose = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setAcceptModal(false)
        setAccepted(false)
        setDeclined(false)
        setDeclinedModal(false)
        setOfferToChange(undefined)
        handleOperationChange(false)
    }
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])
    useEffect(() => {
        if (userDetails && userDetails.userWallet) {
            getUser()
        }
    }, [userDetails])
    useEffect(() => {
        if (sentRequests !== undefined && receivedRequests != undefined)
            setLoading(false)
    }, [sentRequests, receivedRequests])
    const getUser = async () => {
        try {
            apiCall.current = AUTH_API.request({
                path: `/auth/user/get/`,
                method: "post",
                body: {
                    wallet_address: userDetails.userWallet,
                    id: ""
                },
            })
            const response = await apiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            var fetchedOffers = response.data.offers
            var length = response.data.offers.length
            let sent = []
            let received = []
            for (var i = 0; i < length; i++) {
                if (fetchedOffers[i].from_wallet_address == userDetails.userWallet)
                    sent.push(fetchedOffers[i])
                else received.push(fetchedOffers[i])
            }
            setSentRequests(sent)
            setReceivedRequests(received)
        }
        catch (err) {
            setErr("Failed to load offers")
            setLoading(false)
        }
    }

    const handleAccept = async (offer) => {
        setOfferToChange(offer)
        setAccepted(true)
        setAcceptModal(true)
    }
    const handleReject = async (offer) => {
        setOfferToChange(offer)
        setDeclined(true)
        setDeclinedModal(true)
    }
    const onCancel = async (Offer) => {
        // console.log(Offer)
        const res = await userDetails.marketContract.delete_offer({
            args: {
                token_id: Offer.nft_id,
                nft_contract_id: userDetails.nftContract.contractId,
            },
            accountId: userDetails.userWallet,
            amount: "1"
        });
        console.log(res)
    }
    return (
        <Box className="container">
            {loading ? <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress /></Box> :
                err ? <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'red', fontWeight: 'bold' }}>{err}</Typography>
                </Box> :
                    <>

                        <Box className="row" sx={{ margin: '10vh 0vh' }}>
                            <Box className="col-md-6">
                                <>
                                    <Box sx={{ borderBottom: `1px solid ${theme.pallete.lightBorder}` }}>
                                        <Typography variant="h4" sx={{ color: theme.pallete.lightBlue }}>Sent requests</Typography>
                                    </Box>
                                    {
                                        sentRequests.length == 0 ?
                                            <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography sx={{ color: theme.pallete.lightBlue }}>No Offers found</Typography>
                                            </Box>
                                            :
                                            sentRequests.map((offer, index) => {
                                                return <>
                                                    <OfferBox key={index} Offer={offer} isSent={true} />

                                                </>
                                            })}
                                </>
                            </Box>

                            <Box className="col-md-6">
                                <>
                                    <Box sx={{ borderBottom: `1px solid ${theme.pallete.lightBorder}` }}>
                                        <Typography variant="h4" sx={{ color: theme.pallete.lightBlue }}>Received requests</Typography>
                                    </Box>
                                    {
                                        receivedRequests.length == 0 ?
                                            <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography sx={{ color: theme.pallete.lightBlue }}>No Offers found</Typography>
                                            </Box>
                                            :
                                            receivedRequests.map((offer, index) => {
                                                return <>
                                                    <OfferBox key={index} Offer={offer} isSent={false} />
                                                </>
                                            })}
                                </>
                            </Box>
                        </Box>
                    </>
            }
            <AcceptModal
                open={acceptModal}
                onClose={handleClose}
                accepted={accepted}
                offer={offerToChange}
                user={userDetails}
                isOperationDone={isOperationDone}
                setIsOperationDone={handleOperationChange}
            />
            <RejectModal
                open={declinedModal}
                onClose={handleClose}
                declined={declined}
                offer={offerToChange}
                user={userDetails}
                isOperationDone={isOperationDone}
                setIsOperationDone={handleOperationChange}
            />
        </Box >
    )

    function OfferBox({ Offer, isSent }) {
        // <Link to={`/collections/${collection.title}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
        return <div style={{ position: 'relative', marginTop: "80px", marginBottom: '10px' }}>
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
                                    backgroundImage: BG_URL(PUBLIC_URL(Offer.nft_media)),
                                    height: '100px',
                                    width: '100px',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '50px',
                                }} />
                            </div>
                        </div>
                        <div className="col-4">
                        </div>
                    </div>

                    <CardWithTitle title={`${Offer.nft_title}`} width="90%" marginTop="80px" fontSize="16px" responsiveFontSize="12px">
                        <div className="row text-center">
                            <div className="col-6">
                                {isSent ?
                                    <>
                                        <div>To:</div>
                                        <Typography>{Offer.to_wallet_address}</Typography>
                                    </>
                                    :
                                    <>
                                        <div>From:</div>
                                        <Typography>{Offer.from_wallet_address}</Typography>
                                    </>
                                }

                            </div>
                            <div className="col-6">
                                <div>Price:</div>
                                <Typography>{Offer.price} Ⓝ</Typography>
                            </div>
                        </div>
                    </CardWithTitle>
                    {Offer.status != "waiting" ?
                        Offer.status == "accepted" ?
                            <Typography sx={{ margin: '23px 0px', textAlign: 'center', color: theme.pallete.lightBlue }}>Offer accepted.</Typography>
                            :
                            Offer.status == "declined" ?
                                <Typography sx={{ margin: '23px 0px', textAlign: 'center', color: theme.pallete.lightBlue }}>Offer rejected.</Typography>
                                :
                                <Typography sx={{ margin: '23px 0px', textAlign: 'center', color: theme.pallete.lightBlue }}>You are not owner of NFT.</Typography>
                        :
                        isSent === false ?
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: "10px 0px" }}>
                                <Box className="text-center">
                                    <div style={{ margin: '5px', fontSize: '12px' }}>Accept</div>
                                    <div><ThumbUpOffAltIcon onClick={() => { handleAccept(Offer) }} sx={{ color: 'green', cursor: "pointer", fontSize: '24px' }} /></div>
                                </Box>
                                <Box className="text-center">
                                    <div style={{ margin: '5px', fontSize: '12px' }}>Decline</div>
                                    <div><ThumbDownOffAltIcon onClick={() => handleReject(Offer)} sx={{ color: 'red', cursor: "pointer", fontSize: '24px' }} /></div>
                                </Box>
                            </Box>
                            :
                            // <Box sx={{ height: '60px', textAlign: 'center', color: theme.pallete.lightBlue }}></Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: "10px 0px" }}>
                                <Box className="text-center">
                                    <div style={{ margin: '5px', fontSize: '12px' }}>Cancel</div>
                                    <div><CloseIcon onClick={() => { onCancel(Offer) }} sx={{ color: 'red', cursor: "pointer", fontSize: '24px' }} /></div>
                                </Box>
                            </Box>


                    }
                </div>
            </div>
        </div >
        // </Link>
    }
}