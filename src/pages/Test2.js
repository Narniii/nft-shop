import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'near-api-js';
import { useLocation } from "react-router-dom";

const amountInNEAR = utils.format.formatNearAmount("10000000000000000000000");
const amountInYocto = utils.format.parseNearAmount("1");




export default function Test2() {
    const search = useLocation().search;
    const account_id = new URLSearchParams(search).get('account_id');
    const transactionHashes = new URLSearchParams(search).get('transactionHashes');
    console.log(transactionHashes)
    console.log(account_id)




    const userDetails = useSelector(state => state.userReducer)
    useEffect(() => {
        // console.log(userDetails)
    }, [userDetails])

    const handleStorageDeposit = async () => {
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
            <div>Test</div>
            <button onClick={() => handleStorageDeposit()}>storage_deposit</button>
        </>
    )
}
