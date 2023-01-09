import { Box, CircularProgress, Modal, Typography, useTheme } from '@mui/material';
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import TxtButton from '../../../components/TxtButton';
import { useEffect } from 'react';
import { utils } from 'near-api-js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function PutOnMarketPlaceModal({ open, onClose, NFT, putOnMarketPlacePrice, onChange, onClick, err }) {
    const [balance, setBalance] = useState(0.01)
    const userDetails = useSelector(state => state.userReducer)
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
        fontSize: { xs: '12px', md: '14px' }
    };
    const [loading, setLoading] = useState(true)
    var amountInNEAR;
    useEffect(() => {
        if (balance != undefined) {
            amountInNEAR = utils.format.formatNearAmount(balance);
            setLoading(false)
            console.log(balance)
            console.log(amountInNEAR)
        }
    }, [balance])


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: `2px solid ${theme.pallete.lightBorder}`, marginBottom: '10px' }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Sell on marketplace</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                {loading ? <CircularProgress style={{ margin: "0 auto", color: "white", fontSize: "10px" }} /> : <>
                    {balance >= 0.01 ?
                        <>
                            <form autoComplete='off'>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', color: theme.pallete.darkText }}>
                                    <Typography>NFT Listing Price:</Typography>
                                    {/* <Typography>Balance:{formatNearAmount(balance, 2)} Ⓝ</Typography> */}
                                </Box>
                                <Box sx={{ width: '100%', padding: '5px ', marginBottom: 5 }}>
                                    <input type="number" className='form-control' style={{ backgroundColor: 'transparent', color: 'white' }} onChange={onChange} />
                                    <Typography sx={{ textAlign: 'end', margin: '5px 0px' }}>NFT Listing Price:&nbsp;{putOnMarketPlacePrice}&nbsp;Ⓝ</Typography>
                                </Box>
                                <Box sx={{ padding: '10px 20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TxtButton
                                        text="List to sell on marketplace"
                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                        borderColor="rgba(27, 127, 153, 1)"
                                        width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                        margin='30px auto'
                                        onClick={onClick}
                                        fontSize="12px"
                                    />
                                </Box>
                            </form>
                            {err ? <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>{err}</Typography> : undefined}
                        </>
                        : <Box>
                            There's no enough storage in your wallet , you can deposit <Link to='/storage-deposit'>here</Link>
                        </Box>}
                </>}
            </Box>
        </Modal >
    )
}
