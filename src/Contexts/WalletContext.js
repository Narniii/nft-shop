import React, { createContext, useState, useEffect } from 'react';
import { connect, WalletConnection, utils, Contract } from 'near-api-js';
import axios from 'axios'
import { API_CONFIG } from '../config';

const { format: { formatNearAmount } } = utils;
export const WalletContext = createContext();
const amountInYocto = utils.format.parseNearAmount("1");

const WalletContextProvider = (props) => {
    const [nearWalletDetails, setNearWalletDetails] = useState(null);
    const [wallet, setWallet] = useState(undefined)
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState('');
    const [user, setUser] = useState(undefined)

    const nearConnect = (near) => {
        setNearWalletDetails(near)
    }
    const deployContract = async (near) => {
        try {
            let data = await fetch('../wasm/nft.wasm');
            let buf = await data.arrayBuffer();
            const response = await near.account(near.getAccountId()).deployContract(new Uint8Array(buf));
            console.log(response)
        }
        catch (err) {
            console.log(err)
        }
    }
    const requestLogin = () => {
        handleLogin()
    }

    const handleLogout = () => {
        setWallet(undefined)
        nearWalletDetails.signOut();
    };

    const handleLogin = () => {
        nearWalletDetails.requestSignIn({
            contractId: 'mlkk.testnet',
            methodNames: [
                'new_default_meta',
                'nft_metadata',
                'nft_token',
                'nft_tokens_for_owner',
                'nft_tokens',
                'nft_supply_for_owner',
                'nft_payout',
                'nft_transfer_payout',
                'nft_transfer_call',
                'nft_mint',
                'nft_approve',
            ],
        });
    };

    useEffect(() => {
        if (nearWalletDetails) {
            setContract(
                new Contract(nearWalletDetails.account(), 'mlkk.testnet', {
                    viewMethods: [
                        'new_default_meta',
                        'nft_metadata',
                        'nft_token',
                        'nft_tokens_for_owner',
                        'nft_tokens',
                        'nft_supply_for_owner',
                        'nft_payout',
                        'nft_transfer_payout',
                    ],
                })
            );
            // We can get the account balance of a user through the wallet
            // Since this is requesting data from the blockchain, the method returns a Promise
            if (nearWalletDetails.account().accountId) {
                nearWalletDetails.account().getAccountBalance().then(({ available }) => setBalance(available));
                aquaLogin(nearWalletDetails)
                let deployed = localStorage.getItem('isContractSet')
                console.log(deployed)
                if (deployed === null) {
                    localStorage.setItem('isContractSet', "true")
                    deployContract(nearWalletDetails)
                }
            }
        }
    }, [nearWalletDetails]);

    const aquaLogin = async (wallet) => {
        console.log('aqua login')
        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.AUTH_API_URL}/auth/user/login/`,
                data: { wallet_address: wallet._authData.accountId },
            });
            console.log(response)
            if (response.status == 200) {
                setWallet(nearWalletDetails)
                setUser(response.data.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleMint = async (name, description, media) => {
        try {
            const res = await contract.nft_mint({
                args: {
                    token_id: `${Math.floor(Math.random() * 100000)}`,
                    metadata: {
                        title: name,
                        description: description,
                        media: media
                    },
                    receiver_id: "aqua.testnet",
                },
                accountId: wallet.account,
                amount: amountInYocto
            });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <WalletContext.Provider value={{ user, nearConnect, contract, handleLogin, handleLogout, wallet, balance, handleMint, requestLogin }}>
            {props.children}
        </WalletContext.Provider>
    )
}
export default WalletContextProvider
