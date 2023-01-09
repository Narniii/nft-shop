import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'near-api-js';
const amountInYocto = utils.format.parseNearAmount("0.000000000000000000000001");
const amountInNEAR = utils.format.formatNearAmount("1");



export default function Test3() {
    const userDetails = useSelector(state => state.userReducer)
    useEffect(() => {
        console.log(userDetails)
    }, [userDetails])
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

    return (
        <>
            <div>Test</div>
            <button onClick={() => handleStorageWithdraw()}>storage_withdraw</button>
        </>
    )
}
