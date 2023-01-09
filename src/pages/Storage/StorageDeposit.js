import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'near-api-js';
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, useTheme } from '@mui/material';
import InputTitles from '../../components/InputTitles';
import './Storage.css'
import TxtButton from '../../components/TxtButton';
import { useNavigate } from 'react-router-dom';

const amountInNEAR = utils.format.formatNearAmount("10000000000000000000000");
const amountInYocto = utils.format.parseNearAmount("1");




export default function StorageDeposit() {
    const theme = useTheme()
    const [storageCost, setStorageCost] = useState(0.01)
    const [err, setErr] = useState(undefined)
    const userDetails = useSelector(state => state.userReducer)
    useEffect(() => {
        // console.log(userDetails)
    }, [userDetails])
    const navigate = useNavigate();
    const search = useLocation().search;
    const account_id = new URLSearchParams(search).get('account_id');
    const transactionHashes = new URLSearchParams(search).get('transactionHashes');
    const errorCode = new URLSearchParams(search).get('errorCode');
    useEffect(() => {
        if (transactionHashes) {
            let url = search + "&origin=storage-deposit" + "&message=storage-deposite-successfully-done"
            navigate(`/near-callback${url}`)
        }
        else if (errorCode) {
            let url = search + "&origin=storage-deposit" + "&message=something-went-wrong"
            navigate(`/near-callback${url}`)
        }
    }, [])
    const onChange = (e) => {
        if (e.target.value > 0.01)
            setStorageCost(e.target.value)
        else
            setStorageCost(0.01)
    }

    const handleStorageDeposit = async () => {
        if (storageCost < 0.01) {
            setErr("Minimum amount required is 0.01 Ⓝ")
        }
        try {
            const res = await userDetails.marketContract.storage_deposit({
                args: {
                    account_id: userDetails.marketContract.account.accountId,
                },
                accountId: userDetails.marketContract.account.accountId,
                amount: amountInYocto
            });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <>
            <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '60vh', flexDirection: 'column' }}>
                <Box className="storage-custom-inputs-wrapper">
                    <InputTitles title="Storage Deposit" variant="h2" isBold={true} margin="10px" explanation="In order to list your Nfts on marketplace you need to deposit minimum amount of 0.01Ⓝ for the storage cost" />
                    <Box sx={{ margin: '10px' }}>
                        <span style={{ color: theme.pallete.lightBlue, fontSize: 50, verticalAlign: 'top' }}>*</span>
                        <Typography sx={{ display: 'inline-block', verticalAlign: 'sub', color: '#999a9f' }}>You can always withdraw the storage cost from &nbsp;<Link to="/storage-withdraw">here</Link></Typography>
                    </Box>
                    <input onChange={onChange} type="number" className="form-control" value={storageCost} />
                </Box>

                <TxtButton text="Proceed" bgColor={theme.pallete.lightBlue} color="white" displayType="inline-block" borderColor={"#04a5c3"} onClick={() => handleStorageDeposit()} margin={'40px 0px'} />
            </Box>
        </>
    )
}
