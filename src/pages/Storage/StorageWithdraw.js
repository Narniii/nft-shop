import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'near-api-js';
import { Link, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import InputTitles from '../../components/InputTitles';
import './Storage.css'
import TxtButton from '../../components/TxtButton';
import { useNavigate } from 'react-router-dom';





var amountInNEAR;
var amountInYocto = utils.format.parseNearAmount("0.000000000000000000000001");

export default function StorageWithdraw() {
    const theme = useTheme()
    const [storageCost, setStorageCost] = useState(0.01)
    const [err, setErr] = useState(undefined)
    const userDetails = useSelector(state => state.userReducer)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (userDetails)
            getBalance()
        // console.log(userDetails)
    }, [userDetails])
    const navigate = useNavigate();
    const search = useLocation().search;
    const account_id = new URLSearchParams(search).get('account_id');
    const transactionHashes = new URLSearchParams(search).get('transactionHashes');
    const errorCode = new URLSearchParams(search).get('errorCode');
    const [balance, setBalance] = useState(undefined)
    useEffect(() => {
        if (balance != undefined) {
            amountInNEAR = utils.format.formatNearAmount(balance);
            setLoading(false)
            console.log(balance)
            console.log(amountInNEAR)
        }
    }, [balance])
    useEffect(() => {
        if (transactionHashes) {
            let url = search + "&origin=storage-withdraw" + "&message=withdraw-successfully-done"
            navigate(`/near-callback${url}`)
        }
        else if (errorCode) {
            let url = search + "&origin=storage-deposit" + "&message=something-went-wrong"
            navigate(`/near-callback${url}`)
        }
    }, [])
    const handleStorageWithdraw = async () => {
        try {
            const res = await userDetails.marketContract.storage_withdraw({
                args: {},
                accountId: userDetails.marketContract.account.accountId,
                amount: amountInYocto
            });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    };
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

    return (
        <>
            {loading ? <CircularProgress style={{color:"white"}}/> :
                <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '60vh', flexDirection: 'column' }}>
                    <Box className="storage-custom-inputs-wrapper">
                        <InputTitles title="Storage Withdraw" variant="h2" isBold={true} margin="10px" explanation="withdraw the maintaining balance of purchased storage" />
                        <Box sx={{ margin: '10px' }}>
                            <span style={{ color: theme.pallete.lightBlue, fontSize: 50, verticalAlign: 'top' }}>*</span>
                            <Typography sx={{ display: 'inline-block', verticalAlign: 'sub', color: '#999a9f' }}>You can deposite more storage &nbsp;<Link to="/storage-withdraw">here</Link></Typography>
                        </Box>
                        {/* <input onChange={onChange} type="number" className="form-control" value={storageCost} /> */}
                        <Typography sx={{ display: 'inline-block', verticalAlign: 'sub', color: '#fff' }}>your balance in near : {amountInNEAR} Ⓝ</Typography>
                    </Box>
                    <TxtButton text="Proceed" bgColor={theme.pallete.lightBlue} color="white" displayType="inline-block" borderColor={"#04a5c3"} onClick={() => handleStorageWithdraw()} margin={'40px 0px'} />
                </Box>
            }
        </>
    )
}
