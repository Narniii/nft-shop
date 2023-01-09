import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Typography, useTheme } from '@mui/material'
import AcceptModal from '../../pages/Offers/AcceptModal'
import RejectModal from '../../pages/Offers/RejectModal'
import { useState } from "react";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useEffect } from "react";
const OffersTab = ({ nft, user, collection, transactionHashes, urlStatus, location, errorCode }) => {
    const theme = useTheme()
    const id = useParams()
    const [offerToChange, setOfferToChange] = useState(undefined)
    const navigate = useNavigate()

    const [acceptModal, setAcceptModal] = useState(false)
    const [accepted, setAccepted] = useState(undefined)

    const [declinedModal, setDeclinedModal] = useState(undefined)
    const [declined, setDeclined] = useState(undefined)
    const [isOperationDone, setIsOperationDone] = useState(undefined)
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
    const handleAccept = async (offer) => {
        localStorage.setItem("offer", JSON.stringify(offer))
        setOfferToChange(offer)
        setAccepted(true)
        setAcceptModal(true)
    }
    const handleReject = async (offer) => {
        localStorage.setItem("offer", JSON.stringify(offer))
        setOfferToChange(offer)
        setDeclined(true)
        setDeclinedModal(true)
    }
    useEffect(() => {
        if (!nft || !collection) {
            return
        }
        if (errorCode) navigate(`/collections/${id.name}/assets/${id.id}`)
        else if (transactionHashes) {
            switch (urlStatus) {
                case "accept-offer":
                    setAcceptModal(true)
                    break;
                case "reject-offer":
                    setDeclinedModal(true)
                default: return;
            }
        }
        else {
            switch (urlStatus) {
                case "accept-offer":
                    setAcceptModal(true)
                    break;
                case "reject-offer":
                    setDeclinedModal(true)
                default: return;
            }
        }

    }, [nft, collection, user, location])
    return (
        <Box sx={{ margin: '0 auto', height: "400px", width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", }, padding: "0 20px" }}>
            {nft.offers.length != 0 ?
                <>
                    {nft.offers.map((offer, index) => {
                        return <Box sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "10px" }}>
                            <Box>
                                <Link to={`/creator/${offer.from_wallet_address}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{offer.from_wallet_address}</Link>
                                <Typography sx={{ display: 'inline-block' }}>&nbsp;requested</Typography>
                                <Typography sx={{ display: 'inline-block' }}>&nbsp;to buy</Typography>
                                <Typography sx={{ display: 'inline-block' }}>&nbsp;for {offer.price} Ⓝ </Typography>
                                <Typography sx={{ display: 'inline-block' }}>from &nbsp;</Typography>
                                <Link to={`/creator/${offer.to_wallet_address}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{offer.to_wallet_address}</Link>


                                {offer.status == "waiting" && user && user.userWallet && offer.to_wallet_address == user.userWallet ?
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: "10px 0px" }}>
                                        <Box className="text-center">
                                            <div style={{ margin: '5px', fontSize: '12px' }}>Accept</div>
                                            <div><ThumbUpOffAltIcon onClick={() => { handleAccept(offer) }} sx={{ color: 'green', cursor: "pointer", fontSize: '24px' }} /></div>
                                        </Box>
                                        <Box className="text-center">
                                            <div style={{ margin: '5px', fontSize: '12px' }}>Decline</div>
                                            <div><ThumbDownOffAltIcon onClick={() => handleReject(offer)} sx={{ color: 'red', cursor: "pointer", fontSize: '24px' }} /></div>
                                        </Box>
                                    </Box>
                                    :
                                    <Box sx={{ height: '60px', textAlign: 'center', color: theme.pallete.lightBlue }}></Box>
                                }
                            </Box>
                        </Box>
                    })}
                </>
                :
                <>
                    <Box sx={{ borderRadius: "15px", height: "80px", margin: "10px 20px", backgroundColor: "#606370", padding: "10px" }}>
                        <div className="h-100 d-flex justify-content-center align-items-center text-light">No offers found.</div>
                    </Box>
                </>
            }
            <AcceptModal
                open={acceptModal}
                onClose={handleClose}
                accepted={accepted}
                offer={offerToChange}
                user={user}
                isOperationDone={isOperationDone}
                setIsOperationDone={handleOperationChange}
                status={urlStatus}
                transactionHashes={transactionHashes}
            />
            <RejectModal
                open={declinedModal}
                onClose={handleClose}
                declined={declined}
                offer={offerToChange}
                user={user}
                isOperationDone={isOperationDone}
                setIsOperationDone={handleOperationChange}
            />
        </Box>
    );
}

export default OffersTab;