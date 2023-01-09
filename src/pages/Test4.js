import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { utils } from 'near-api-js';
const amountInYocto = utils.format.parseNearAmount("0.01");



export default function Test4() {
    const userDetails = useSelector(state => state.userReducer)
    useEffect(() => {
        console.log(userDetails)
    }, [userDetails])
    const handleListOnTheMarketplace = async () => {
        try {
            const res = await userDetails.nftContract.nft_approve({
                args: {
                    token_id: "dljikzmysy2005621145",
                    account_id: "market.bitzio.testnet",
                    msg: JSON.stringify({ sale_conditions: "4" })
                },
                accountId: userDetails.nftContract.account.accountId,
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
            <button onClick={() => handleListOnTheMarketplace()}>list on the marketplace</button>
        </>
    )
}
