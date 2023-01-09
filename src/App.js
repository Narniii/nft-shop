import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { connect, WalletConnection, utils, Contract } from 'near-api-js';
import { CRYPTO_RANK_APIKEY, getConfig } from './config';
import { getuser, setAccount, setNftContract, setMarketContract, setNearWalletObject, setProposalContract, setEventContract, setNearAmount } from './redux/actions';
import Home from './pages/home/Home';
import CollectionSingle from './pages/Collections/CollectionSingle/CollectionSingle';
import Footer from './layout/Footer';
import CreateNFT from './pages/NFT/CreateNFT';
import Navbar from './layout/Navbar';
import Categories from './pages/Categories/Categories';
// import NFTSingle from './pages/NFT/NFTSingle';
import SingleNft from './pages/NFT/SingleNFT';
import Creator from './pages/Creator/Creator';
import CreateCollection from './pages/Collections/Collection-create/CreateCollection';
import NoMatch from './pages/NotFound/NotFound';
import EditCollection from './pages/Collections/Collection-create/EditCollection';
import EditNft from './pages/NFT/EditNft';
import AllCollections from './pages/Collections/AllCollctions';
import MyCollections from './pages/Collections/Mycollections/MyCollections';
import CreateEvent from './pages/Events/CreateEvent';
import Test from './pages/Test';
import Test2 from './pages/Test2';
import Test3 from './pages/Test3';
import Test4 from './pages/Test4';
import Test6 from './pages/Test6';
import EditEvent from './pages/Events/EditEvent';
import AllEvents from './pages/Events/AllEvents';
import StorageDeposit from './pages/Storage/StorageDeposit';
import StorageWithdraw from './pages/Storage/StorageWithdraw';
import NearCallBack from './pages/NearCallBack/NearCallBack';
import Create from './components/CreateComp';
import Test5 from './pages/Test5';
import EditProfile from './pages/Creator/EditProfile';
import CreateProposal from './pages/Proposal/CreateProposal';
import Offers from './pages/Offers/Offers';
import Explore from './pages/Collections/Explore';
import MintHere from './pages/Collections/Generative/MintingPage';
import CommingSoon from './pages/Merchendise/CommingSoon';
import Market from './pages/Market/Market';
import axios from 'axios';
import Search from './pages/Search/Search';
import AllGenCol from './pages/Collections/AllGenCol';
import GenCollectionSingle from './pages/Collections/CollectionSingle/GenCollectionSingle';
import AttributeSearch from './pages/Search/AttributeSearch';

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 30000);
    return () => clearInterval(interval)
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.cryptorank.io/v1/currencies/21422?api_key=${CRYPTO_RANK_APIKEY}`)
      localStorage.removeItem("nearPrice")
      let nearPrice = response.data.data.values.USD.price
      nearPrice = parseFloat(nearPrice.toString().substring(0, 5));
      localStorage.setItem("nearPrice", nearPrice)
    }
    catch (err) {
      console.log(err)
    }
  }
  const [near, setNear] = useState(undefined)
  const [wallet, setWallet] = useState(undefined)
  const dispatch = useDispatch();
  useEffect(() => {
    nearConnection()
  }, []);

  const nearConnection = async () => {
    let near = await connect(getConfig());
    let wallet = new WalletConnection(near);
    dispatch(setNearWalletObject(wallet));
    const nftContract = new Contract(wallet.account(), 'nft15.bitzio.testnet', {
      viewMethods: [
        'nft_metadata',
        'nft_token',
        'nft_tokens_for_owner',
        'nft_tokens',
        'nft_supply_for_owner',
        'nft_payout',
        'nft_transfer_payout',
        'nft_events'
      ],
      changeMethods: [
        'new_default_meta',
        'nft_mint',
        'nft_transfer',
        'nft_transfer_call',
        'nft_revoke',
        'nft_revoke_all',
        'nft_approve',
        'nft_creator_mint',

      ],
    })
    dispatch(setNftContract(nftContract));
    const marketContract = new Contract(wallet.account(), 'market14.bitzio.testnet', {
      viewMethods: [
        'get_supply_sales',
        'get_supply_by_owner_id',
        'get_supply_by_nft_contract_id',
        'get_sale',
        'get_sales_by_owner_id',
        'get_sales_by_nft_contract_id',
        'storage_balance_of',
        'storage_minimum_balance',
        'get_offer',
        'get_market_data'
      ],
      changeMethods: [
        'storage_deposit',
        'storage_withdraw',
        'remove_sale',
        'update_sale_price',
        'buy',
        'add_offer',
        'delete_offer',
        'add_bid',
        'cancel_bid',
        'accept_bid',
        'end_auction'
      ],
    })
    dispatch(setMarketContract(marketContract));
    const proposalContract = new Contract(wallet.account(), 'proposal3.bitzio.testnet', {
      viewMethods: [
        'get_all_proposals_by_collection',
      ],
      changeMethods: [
        'create',
        'expire_proposal',
        'vote',
        'lock_proposal',
      ],
    })
    dispatch(setProposalContract(proposalContract));
    const eventContract = new Contract(wallet.account(), 'event3.bitzio.testnet', {
      viewMethods: [
        'get_all_events_by_collection',
      ],
      changeMethods: [
        'create',
        'expire_event',
        'vote',
        'lock_event',
      ],
    })
    dispatch(setEventContract(eventContract));
    if (marketContract && marketContract.account && marketContract.account.accountId) {
      dispatch(getuser(marketContract.account.accountId))
      const account = await near.account(marketContract.account.accountId);
      dispatch(setAccount(account))
    }
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        {/* create pages */}
        <Route exact path="/create" element={<Create />} />
        <Route exact path="/create/nft" element={<CreateNFT />} />
        <Route exact path="/create/collection" element={<CreateCollection />} />
        <Route exact path="/create/event" element={<CreateEvent />} />
        <Route exact path="/create/proposal" element={<CreateProposal />} />

        {/* end of create pages */}

        {/* edit pages */}
        <Route exact path="/edit/nft/:id" element={<EditNft />} />
        <Route exact path="/edit/collection/:id" element={<EditCollection />} />
        <Route exact path="/edit/event/:id" element={<EditEvent />} />
        {/* end of edit pages */}

        <Route exact path="/creator/:name" element={<Creator />} />
        <Route exact path="/edit-profile" element={<EditProfile />} />

        {/* <Route exact path="/collections/:name/assets" element={<NFTSingle />} /> */}
        <Route exact path="/collections/:name/assets/:id" element={<SingleNft />} />


        <Route exact path="/my-collections" element={<MyCollections />} />
        <Route exact path="/collections/:id" element={<CollectionSingle />} />
        <Route exact path="/collections/gen/:id" element={<GenCollectionSingle />} />
        <Route exact path="/all-collections" element={<AllCollections />} />
        <Route exact path="/all-generative-collections" element={<AllGenCol />} />
        <Route exact path="/explore" element={<Explore />} />

        <Route exact path="/categories/:category" element={<Categories />} />

        <Route exact path="/all-events" element={<AllEvents />} />

        <Route exact path="/storage-deposit" element={<StorageDeposit />} />
        <Route exact path="/storage-withdraw" element={<StorageWithdraw />} />
        <Route exact path="/near-callback" element={<NearCallBack />} />

        <Route exact path="/offers" element={<Offers />} />

        {/* generative collections */}
        <Route exact path="/mint-calendar/collection/:id" element={<MintHere />} />
        <Route exact path="/merchendise-shop" element={<CommingSoon />} />
        <Route exact path="/market" element={<Market />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/search-by-properties" element={<AttributeSearch />} />


        <Route exact path="/test" element={<Test />} />
        <Route exact path="/test2" element={<Test2 />} />
        <Route exact path="/test3" element={<Test3 />} />
        <Route exact path="/test4" element={<Test4 />} />
        <Route exact path="/test5" element={<Test5 />} />
        <Route exact path="/test6" element={<Test6 />} />

        <Route path='*' element={<NoMatch />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
