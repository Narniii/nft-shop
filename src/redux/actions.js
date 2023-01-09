import axios from 'axios';
import { API_CONFIG } from '../config';
export const GET_USER = 'GET_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const WALLET_CONNECTION = 'WALLET_CONNECTION';
export const SET_MARKET_CONTRACT = 'SET_MARKET_CONTRACT';
export const SET_NFT_CONTRACT = 'SET_NFT_CONTRACT';
export const SET_PROPOSAL_CONTRACT = 'SET_PROPOSAL_CONTRACT';
export const SET_EVENT_CONTRACT = 'SET_EVENT_CONTRACT';
export const SET_ACCOUNT = 'SET_ACCOUNT';

const emptyUser = {
    userId: '',
    userWallet: '',
    isLoggedIn: false,
}
export const getuser = (walletAddress) => {
    try {
        return async dispatch => {
            const response = await axios.post(`${API_CONFIG.AUTH_API_URL}/auth/user/login/`, { wallet_address: walletAddress })
            let userDetails = {}
            if (response.status >= 200 && response.status < 300) {
                userDetails.userId = response.data.data._id.$oid
                userDetails.userWallet = walletAddress
                userDetails.isLoggedIn = true
                dispatch({
                    type: GET_USER,
                    payload: userDetails
                });
            } else {
                dispatch({
                    type: GET_USER,
                    payload: emptyUser
                });
            }
        };
    } catch (error) {
        // Add custom logic to handle errors
        console.log(error);
    }
};
export const logOutUser = () => {
    return async dispatch => {
        dispatch({
            type: LOGOUT_USER,
            payload: emptyUser
        });
    }
}
export const setNearWalletObject = (wallet) => {
    return dispatch => {
        dispatch({
            type: WALLET_CONNECTION,
            payload: wallet
        });
    };
}
export const setMarketContract = (marketContract) => {
    return dispatch => {
        dispatch({
            type: SET_MARKET_CONTRACT,
            payload: marketContract
        });
    };
}
export const setNftContract = (nftContract) => {
    return dispatch => {
        dispatch({
            type: SET_NFT_CONTRACT,
            payload: nftContract
        });
    };
}
export const setProposalContract = (proposalContract) => {
    return dispatch => {
        dispatch({
            type: SET_PROPOSAL_CONTRACT,
            payload: proposalContract
        });
    };
}
export const setEventContract = (eventContract) => {
    return dispatch => {
        dispatch({
            type: SET_EVENT_CONTRACT,
            payload: eventContract
        });
    };
}
export const setAccount = (acc) => {
    return dispatch => {
        dispatch({
            type: SET_ACCOUNT,
            payload: acc
        });
    };

}