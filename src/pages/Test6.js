import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { connect, WalletConnection, utils, Contract, transactions } from 'near-api-js';

export default function Test6() {
    const userDetails = useSelector(state => state.userReducer)
    const [loading, setLoading] = useState()
    useEffect(() => {
        if (userDetails && userDetails.isLoggedIn)
            setLoading(false)
    }, [userDetails])
    const batchTransaction = async () => {
        const account = userDetails.account
        const wallet = userDetails.wallet
        const args1 = {
            account_id: userDetails.marketContract.account.accountId,
        }
        const args2 = {
            token_id: "630a271bbe49e989c9803f71",
            account_id: "market.bitzio.testnet",
            msg: JSON.stringify({ sale_conditions: "4" })
        }
        // const result = await account.signAndSendTransaction({
        //     receiverId: userDetails.userWallet,
        //     actions: [
        //         transactions.functionCall(
        //             "storage_deposit",
        //             Buffer.from(JSON.stringify(args1)),
        //             10000000000000,
        //             utils.format.parseNearAmount("0.01")
        //         ),
        //         transactions.functionCall(
        //             "nft_approve",
        //             Buffer.from(JSON.stringify(args2)),
        //             10000000000000,
        //             utils.format.parseNearAmount("0.01")
        //         ),
        //     ],
        // });
        const res = await wallet.signAndSendTransaction({
            receiverId: userDetails.userWallet,
            actions: [
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: 'storage_deposit',
                        args: args1,
                        deposit: utils.format.parseNearAmount("0.01"),
                    },
                },
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: 'nft_approve',
                        args: args2,
                        deposit: utils.format.parseNearAmount("0.01"),
                    },
                },
            ],
        })
        console.log(res)
    }
    return (
        <Box sx={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {loading ?
                <Typography> Test6</Typography>
                :
                <Button variant="contained" onClick={batchTransaction}>Batch transaction</Button>
            }
        </Box>
    )
}
