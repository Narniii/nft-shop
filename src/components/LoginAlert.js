import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { PUBLIC_URL } from '../utils/utils'

export default function LoginAlert() {
    const userDetails = useSelector(state => state.userReducer)
    const handleLogin = () => {
        userDetails.wallet.requestSignIn({
            contractId: 'market.bitzio.testnet',
            methodNames: [
                'nft_metadata',
                'nft_token',
                'nft_tokens_for_owner',
                'nft_tokens',
                'nft_supply_for_owner',
                'nft_payout',
                'nft_transfer_payout',
                'nft_events',
                'new_default_meta',
                'nft_mint',
                'nft_transfer',
                'nft_transfer_call',
                'nft_revoke',
                'nft_revoke_all',
                'nft_approve',
                'get_supply_sales',
                'get_supply_by_owner_id',
                'get_supply_by_nft_contract_id',
                'get_sale',
                'get_sales_by_owner_id',
                'get_sales_by_nft_contract_id',
                'storage_balance_of',
                'storage_minimum_balance',
                'storage_deposit',
                'storage_withdraw',
                'remove_sale',
                'update_price',
                'offer',
            ],
        });
    };
    return (
        <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '40vh', flexDirection: 'column' }}>

            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>You should login to continue</Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                padding: '20px 0px',
                margin: '50px 0px',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#00a6c5',
                position: 'relative',
                width: { xs: '300px', md: '500px' },
                cursor: 'pointer'
            }}
                onClick={() => handleLogin()}
            >
                <Box sx={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src={PUBLIC_URL('/images/near.png')} style={{ width: '60%' }} />
                </Box>
                <Typography>Login with Near</Typography>
            </Box>

        </Box>
    )
}
