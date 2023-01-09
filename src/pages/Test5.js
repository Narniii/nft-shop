import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GenerateRandomCode from 'react-random-code-generator';
import { utils } from 'near-api-js';
import { Box, Modal, Typography, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TxtButton from '../components/TxtButton';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
const amountInYocto = utils.format.parseNearAmount("4");
export default function Test5() {
    const [balance, setBalance] = useState(undefined)
    const userDetails = useSelector(state => state.userReducer)
    const [openModal, setOpenModal] = useState(true);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const [bid, setBid] = useState(undefined)
    const theme = useTheme()
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "80%", lg: "40%" },
        boxShadow: 24,
        outline: 0,
        borderRadius: '5px'
    };
    useEffect(() => {
        if (userDetails && userDetails.wallet) {
            userDetails.wallet.account().getAccountBalance().then(({ available }) => setBalance(available));
        }
    }, [userDetails])
    const handleMint = async () => {
        try {
            const res = await userDetails.marketContract.offer({
                args: {
                    nft_contract_id: "nft.bitzio.testnet",
                    token_id: "73467832837643",
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: amountInYocto,
                gas: "200000000000000",
            });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <>
            <div>Test</div>
            <button onClick={() => handleMint()}>buy nft</button>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyle}>
                    <Box sx={{ position: 'relative', borderBottom: `2px solid ${theme.pallete.lightBorder}`, padding: '10px 0px' }}>
                        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center' }}>Place bid</Typography>
                        <CloseIcon onClick={handleClose} sx={{ fontSize: '30px', position: 'absolute', top: '0px', right: '10px', cursor: 'pointer' }} />
                    </Box>
                    <form autoComplete='off'>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', padding: '10px 20px', fontSize: '14px', color: theme.pallete.darkText }}>
                            <Typography>Offer amount:</Typography>
                            <Typography>Balance:{formatNearAmount(balance, 4)}</Typography>
                        </Box>
                        <Box sx={{ width: '100%', padding: '5px 20px', marginBottom: 5 }}>
                            <input type="number" className='form-control' style={{ backgroundColor: 'transparent', color: 'white' }} onChange={(e) => setBid(e.target.value)} />
                            <Typography sx={{ textAlign: 'end', margin: '5px 0px' }}>Total offer amount:&nbsp;{bid}&nbsp;Ⓝ</Typography>
                        </Box>
                        <Box sx={{ padding: '10px 20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TxtButton bgColor={theme.pallete.lightBlue} text="Place bid" width="50%" margin='30px auto' />
                        </Box>
                    </form>
                </Box>
            </Modal >
        </>
    )
}
