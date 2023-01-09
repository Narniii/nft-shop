import { Box, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import TxtButton from '../../../components/TxtButton';
import { COLLECTION_API } from '../../../data/collection_api';

export default function BuyNFTModal({ open, onClose, NFT, price, transactionHashes, err, loading, onClick, user, urlStatus }) {
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
    const apiCall = useRef(undefined)
    useEffect(() => {
        if (!transactionHashes || urlStatus !== "buyNFT")
            return
        updateNFTOwner()
    }, [])
    const updateNFTOwner = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/edit/`,
                method: "post",
                body: {
                    nft_id: NFT._id.$oid,
                    price: '',
                    title: "",
                    current_owner: NFT.current_owner,
                    new_current_owner: user.userWallet,
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
            console.log(res)
            if (!res.isSuccess) throw res
        }
        catch (err) {
            console.log(err)
        }
    }
    let items = [
        {
            name: "Title",
            value: NFT.title
        },
        {
            name: "Description",
            value: NFT.description
        },
        {
            name: "Price",
            value: `${NFT.price} Ⓝ`
        }
    ]
    const DetailsRow = ({ name, value }) => {
        return <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography sx={{ margin: "10px 0px" }}>{name}:</Typography>
            <Typography sx={{ margin: "10px 0px" }}>&nbsp;{value}</Typography>
        </Box>
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
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Buy Nft</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                <Box className="row new-mint-wrap" sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>
                    <Box sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                height: { xs: 250, md: 200 },
                                width: { xs: 250, md: 200 },
                                backgroundImage: `url(${NFT.media})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    </Box>
                    {items.map((item, index) => {
                        return <DetailsRow key={index} name={item.name} value={item.value} />
                    })}
                    <div className="text-center" style={{ margin: "10px 0px" }}>
                        {transactionHashes ? (
                            <>
                                <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                                    Congrats! You've bought NFT successfully.
                                </Typography>
                                <Typography sx={{ color: theme.pallete.lightBlue }}>transaction hash:</Typography>
                                <Typography> {transactionHashes}</Typography>
                            </>
                        ) :
                            <TxtButton
                                text="Buy"
                                bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                borderColor="rgba(27, 127, 153, 1)"
                                width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                margin='30px auto'
                                onClick={onClick}
                                fontSize="12px"
                            />
                        }
                        {err ? <Typography variant="h4" sx={{ color: "red", margin: "20px 0px", fontWeight: 'bold' }}>{err}</Typography> : undefined}

                    </div>
                </Box>
            </Box>
        </Modal>
    )
}
