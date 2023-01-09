import { Box, Modal, Typography, useTheme } from '@mui/material';
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";

export default function MintModal({ open, onClose, NFT, transactionHashes }) {
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
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Nft Mint</Typography>
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
                                    NFT minted successfully
                                </Typography>
                                <Typography sx={{ color: theme.pallete.lightBlue }}>Transaction hash:</Typography>
                                <Typography> {transactionHashes}</Typography>
                            </>
                        ) : undefined}
                    </div>
                </Box>
            </Box >
        </Modal >
    )
}
