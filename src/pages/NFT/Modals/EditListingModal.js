import { Box, CircularProgress, Modal, Typography, useTheme } from '@mui/material';
import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import TxtButton from '../../../components/TxtButton';

export default function EditListingModal({ open, onClose, NFT, listingPrice, onChange, balance, onClick, err, transactionHashes, loading }) {
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
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: `2px solid ${theme.pallete.lightBorder}`, marginBottom: '10px' }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Update sell price</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                {transactionHashes ?
                    <Box sx={{ height: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                            Price Updated Successfully
                        </Typography>
                        <Typography sx={{ color: theme.pallete.lightBlue, margin: '20px 0px' }}>transaction hash:</Typography>
                        <Typography> {transactionHashes}</Typography>
                    </Box>
                    :
                    <form autoComplete='off'>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', color: theme.pallete.darkText }}>
                            <Typography>NFT Listing Price:</Typography>
                            {/* <Typography>Balance:{formatNearAmount(balance, 2)} Ⓝ</Typography> */}
                        </Box>
                        <Box sx={{ width: '100%', padding: '5px ', marginBottom: 5 }}>
                            <input type="number" className='form-control' style={{ backgroundColor: 'transparent', color: 'white' }} onChange={onChange} />
                            <Typography sx={{ textAlign: 'end', margin: '5px 0px' }}>NFT Listing Price:&nbsp;{listingPrice}&nbsp;Ⓝ</Typography>
                        </Box>
                        <Box sx={{ padding: '10px 20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {loading ?
                                <TxtButton
                                    text={<CircularProgress size="20px" />}
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                    margin='30px auto'
                                    onClick={onClick}
                                    fontSize="12px"
                                />
                                :
                                <TxtButton
                                    text="Update sell price"
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                    margin='30px auto'
                                    onClick={onClick}
                                    fontSize="12px"
                                />
                            }


                        </Box>
                    </form>
                }
                {err ? <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>{err}</Typography> : undefined}
            </Box>
        </Modal >
    )
}
