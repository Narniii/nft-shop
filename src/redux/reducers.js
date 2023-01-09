import { GET_USER, SET_NFT_CONTRACT, SET_PROPOSAL_CONTRACT, SET_MARKET_CONTRACT, SET_EVENT_CONTRACT, WALLET_CONNECTION, LOGOUT_USER, SET_ACCOUNT } from './actions';
const initialState = {
    userId: '',
    userWallet: '',
    isLoggedIn: false,
    wallet: undefined,
    marketContract: undefined,
    nftContract: undefined,
    account: undefined
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                userId: action.payload.userId,
                userWallet: action.payload.userWallet,
                isLoggedIn: true,
            };
        case LOGOUT_USER:
            return {
                ...state, userId: action.payload.userId,
                userWallet: action.payload.userWallet,
                isLoggedIn: false,
            };
        case WALLET_CONNECTION:
            return { ...state, wallet: action.payload };
        case SET_MARKET_CONTRACT:
            return { ...state, marketContract: action.payload };
        case SET_NFT_CONTRACT:
            return { ...state, nftContract: action.payload };
        case SET_PROPOSAL_CONTRACT:
            return { ...state, proposalContract: action.payload };
        case SET_EVENT_CONTRACT:
            return { ...state, eventContract: action.payload };
        case SET_ACCOUNT:
            return { ...state, account: action.payload };
        default:
            return state;
    }
}

export default userReducer;