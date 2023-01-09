import { Box, CircularProgress, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { COLLECTION_API } from '../../data/collection_api';
import { AUTH_API } from '../../data/auth_api';
import TxtButton from '../../components/TxtButton';
import { STORAGE_COST } from '../../config';
import { utils } from "near-api-js";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

export default function AcceptModal({ open, onClose, accepted, offer, user, isOperationDone, setIsOperationDone, status, transactionHashes }) {
    const navigate = useNavigate()
    const id = useParams()
    const theme = useTheme()
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(undefined)
    const [isCurrentOwner, setIsCurrentOwner] = useState(undefined)
    const apiCall = useRef(undefined)
    const [nft, setNft] = useState(undefined)
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "50%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };
    useEffect(() => {
        if (open)
            fetchNFT()
    }, [open, accepted])
    useEffect(() => {
        if (!open) return
        if (status !== "accept-offer") return
        if (!isCurrentOwner) return
        if (!nft) return
        if (!user.isLoggedIn) return
        if (transactionHashes)
            handleAccept(offer)
        else contractAccept(nft, offer)
    }, [open, isCurrentOwner, status, transactionHashes, offer, nft])
    const fetchNFT = async () => {
        let _offer = localStorage.getItem("offer")
        _offer = await JSON.parse(_offer)
        try {
            apiCall.current = COLLECTION_API.request({
                path: '/cmd/nft/get/',
                method: 'post',
                body: { nft_id: _offer.nft_id }
            })
            const response = await apiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            let nft = response.data[1]
            setNft(nft)
            if (nft.current_owner == user.userWallet)
                setIsCurrentOwner(true)
            else
                setIsCurrentOwner(false)
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            setErr("Failed to load. Please retry.")
            setLoading(false)
        }
    }
    const handleAccept = async () => {
        let _offer = localStorage.getItem("offer")
        _offer = await JSON.parse(_offer)
        console.log(_offer)
        console.log(user.userWallet)
        if (!user.userWallet) return
        try {
            apiCall.current = AUTH_API.request({
                path: "/auth/user/stat/offer/",
                method: "post",
                body:
                {
                    user_id: user.userWallet,
                    offer: [{
                        nft_id: _offer.nft_id,
                        nft_title: _offer.nft_title,
                        nft_media: _offer.nft_media,
                        from_wallet_address: _offer.from_wallet_address,
                        to_wallet_address: _offer.to_wallet_address,
                        price: _offer.price,
                        status: _offer.status
                    }],
                    status: "accepted"
                }
            })
            const response = await apiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw err
            //update owner
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/edit/`,
                method: "post",
                body: {
                    nft_id: _offer.nft_id,
                    price: '',
                    title: "",
                    current_owner: user.userwallet,
                    new_current_owner: _offer.from_wallet_address,
                    perpetual_royalties: "",
                    description: '',
                    extra: "",
                    reference: "",
                    expires_at: "",
                    approved_account_ids: "",
                    media: "",
                    price_history: "",
                    listings: ""
                },
            });
            const res = await apiCall.current.promise
            if (!res.isSuccess) throw res
            localStorage.removeItem("offer")
            setIsOperationDone(true)
        }
        catch (err) {
            console.log(err)
        }
    }
    const contractAccept = async (nft) => {
        let _offer = localStorage.getItem("offer")
        _offer = await JSON.parse(_offer)
        console.log("here")
        const res = await user.nftContract.nft_approve({
            args: {
                token_id: nft._id.$oid,
                account_id: user.marketContract.contractId,
                msg: JSON.stringify({
                    market_type: "accept_offer",
                    buyer_id: _offer.from_wallet_address,
                    price: utils.format.parseNearAmount(`${_offer.price}`),
                })
            },
            accountId: user.userWallet,
            amount: utils.format.parseNearAmount(`${STORAGE_COST.STORAGE_MINT_FEE}`),
            gas: STORAGE_COST.LISTING_FEE_GAS
        });

    }
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: `1px solid ${theme.pallete.lightBorder}` }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h4">Accept Offer</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box>
                    {loading ?
                        <Box sx={{ minHeight: "10vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress /></Box> :
                        err ? <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {err}</Box> :
                            isCurrentOwner ?
                                !transactionHashes ?
                                    <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <Typography>Are you sure you want to accept this offer?</Typography>
                                        <TxtButton
                                            text={`Yes`}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            width="95%"
                                            onClick={() => navigate(`/collections/${id.name}/assets/${id.id}?status=accept-offer`)}
                                        />
                                        <TxtButton
                                            text={`No`}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="12px"
                                            width="95%"
                                            onClick={onClose}
                                        />
                                    </Box> :
                                    <Box sx={{ minHeight: "20vh", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <Typography variant="h5" sx={{ color: 'green', margin: '20px 0px' }}>You have accepted the offer!</Typography>
                                    </Box>
                                :
                                <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4" sx={{ color: 'red' }}>You are not the current owner of NFT !</Typography>
                                </Box>
                    }
                </Box>
            </Box>
        </Modal >
    )
}
