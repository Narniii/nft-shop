import { keyStores } from 'near-api-js';

/**
 * Function that returns a NEAR connection configuration object based on the given environment.
 *
 * @param  {string} environment='testnet'
 * @return {object}
 */
const ISLOCALHOST = false;
const AZIN_URL = "http://192.168.1.108";
export const API_CONFIG = {
  AUTH_API_URL: ISLOCALHOST ? `${AZIN_URL}:8005` : 'https://api.auth.bitzio.ir:8297',
  COLLECTIONS_API_URL: ISLOCALHOST ? `${AZIN_URL}:8006` : 'https://api.collection.bitzio.ir:2873',
  EVENTS_API_URL: ISLOCALHOST ? `${AZIN_URL}:8007` : 'https://api.event.bitzio.ir:3489',
}

export const NFT_STORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZhRjhFRDFhMDI1OWJjNmRkYjNlYUExRGUxOTNFOWRGMGEwNzRlMDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzYxNzE0NTg0MSwibmFtZSI6ImJpdHppbyJ9.Qz5P5Sl8eL6sl_tARloeWf5GVjSc9EubH6l2Rf95EP4"
export const PROPOSAL_API_KEY = "fnet2@345dj&^ehus"
export const CRYPTO_RANK_APIKEY = "48aa53f5833eb478340a4e390bbb2f988d9bec1b9e5a5d2e1bd4037481c7"
export const getConfig = (environment = 'testnet') => {
  switch (environment) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'betanet':
      return {
        networkId: 'betanet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
      };
    case 'testnet':
    default:
      return {
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
  }
};
export const STORAGE_COST = {
  STORAGE_ADD_MARKET_FEE: '8590000000000000000000',
  STORAGE_MINT_FEE: 0.01,
  STORAGE_CREATE_SERIES_FEE: '8540000000000000000000',
  STORAGE_APPROVE_FEE: '800000000000000000000',
  LISTING_FEE_GAS: "200000000000000",

  GAS_FEE: `100000000000000`,
  GAS_FEE_150: `150000000000000`,
  GAS_FEE_200: `200000000000000`,
  GAS_FEE_300: `300000000000000`,
  ACCEPT_GAS_FEE: `200000000000000`,
}