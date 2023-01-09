import { Box, CircularProgress, Modal, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import TxtButton from '../../../components/TxtButton';
import { COLLECTION_API } from '../../../data/collection_api';
import { utils } from 'near-api-js';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function SendOfferModal({ open, onClose, nft, balance, offerPrice, setOfferPrice }) {
    useEffect(() => {
        console.log("annnnnnnnnnnnnnnnnnnnnnnnnnnnn")
        console.log(open)
    }, [])
    let [searchParams, setSearchParams] = useSearchParams();
    const id = useParams()
    const navigate = useNavigate()
    const transactionHashes = searchParams.get('transactionHashes')
    const theme = useTheme()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(undefined)
    const [successMessage, setSuccessMessage] = useState(undefined)
    const apiCall = useRef(undefined)
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
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])
    const handleSubmit = async () => {
        if (offerPrice == undefined) {
            setErr("please determine your offer price")
            setLoading(false)
            return
        }
        navigate(`/collections/${id.name}/assets/${id.id}?status=sendOffer&offerPrice=${offerPrice}`)
    }
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={ModalStyle}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: `2px solid ${theme.pallete.lightBorder}`, marginBottom: '10px' }}>
                    <Typography sx={{ margin: "10px 0px" }} id="modal-modal-title" variant="h6" component="h2">Send offer</Typography>
                    <CloseIcon
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>
                {transactionHashes ?
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center", margin: "50px" }}>
                            <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>Offer submited successfully</Typography>
                            <Typography sx={{ color: theme.pallete.lightBlue, fontSize: "9px" }}>Transaction hash:</Typography>
                            <Typography> {transactionHashes}</Typography>
                        </Box>
                    </>
                    :
                    <form autoComplete='off'>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', color: theme.pallete.darkText }}>
                            <Typography>Offer amount in Near:</Typography>
                            <Typography>Balance:{formatNearAmount(balance, 2)} Ⓝ</Typography>
                        </Box>
                        <Box sx={{ width: '100%', padding: '5px ', marginBottom: 5 }}>
                            <input type="number" className='form-control' style={{ backgroundColor: 'transparent', color: 'white' }} onChange={(e) => setOfferPrice(e.target.value)} />
                            <Typography sx={{ textAlign: 'end', margin: '5px 0px' }}>Offer Price:&nbsp;{offerPrice}&nbsp;Ⓝ</Typography>
                        </Box>
                        <Box sx={{ padding: '10px 20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {loading ?
                                <TxtButton
                                    text={<CircularProgress size="20px" />}
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                    margin='30px auto'
                                    fontSize="12px"
                                />
                                :
                                <TxtButton
                                    text="Send Offer to NFT owner"
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    width={{ xs: '100%', sm: '70%', md: '70%', lg: '50%' }}
                                    margin='30px auto'
                                    onClick={handleSubmit}
                                    fontSize="12px"
                                />
                            }
                        </Box>
                    </form>
                }

                {err ? <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>{err}</Typography> : undefined}
                {successMessage ? <Typography variant="h5" sx={{ color: 'green', textAlign: 'center' }}>{successMessage}</Typography> : undefined}
            </Box>
        </Modal >
    )
}
