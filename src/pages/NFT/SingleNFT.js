import React, { useContext, useEffect, useRef, useState } from 'react'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import './NFT.css'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CircularProgress, Modal, Typography, useTheme } from '@mui/material';
import InfoTab from '../../components/nft info/InfoTab';
import OwnersTab from '../../components/nft info/OwnersTab';
import OffersTab from '../../components/nft info/OffersTab';
import PublicationTab from '../../components/nft info/PublicationTab';
import NftHistory from '../../components/nft info/NftHistory';
import LoginAlert from '../../components/LoginAlert';
import { useSelector } from 'react-redux';
import { COLLECTION_API } from '../../data/collection_api';
import { utils } from "near-api-js";
import CloseIcon from "@mui/icons-material/Close";
import TxtButton from "../../components/TxtButton";
import MintModal from './Modals/MintModal';
import PutOnMarketPlaceModal from './Modals/PutOnMarketPlaceModal';
import ListingPriceModal from './Modals/ListingPriceModal';
import EditListingModal from './Modals/EditListingModal';
import BuyNFTModal from './Modals/BuyNFTModal';
import SendOfferModal from './Modals/SendOfferModal';
import { PlaceBidModal, StartAuctionModal } from './Modals/AuctionModals';
import AuctionTab from '../../components/nft info/AuctionTab';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoadingComponent from '../../components/loading/LoadingComponent';
import { STORAGE_COST } from '../../config';
import { useMemo } from 'react';
import MintForAnotherModal from './Modals/MintForAnotherModal';
export default function SingleNFT() {
    const userDetails = useSelector(state => state.userReducer)

    const theme = useTheme();
    const id = useParams()
    const navigate = useNavigate();
    const location = useLocation();

    const apiCall = useRef(undefined)
    const auctionApiCall = useRef(undefined)

    let [searchParams, setSearchParams] = useSearchParams();
    const urlStatus = searchParams.get('status')
    const transactionHashes = searchParams.get('transactionHashes')
    const errorCode = searchParams.get('errorCode')
    const errorMessage = searchParams.get('errorMessage')
    const listingPriceOnContract = searchParams.get('price')

    const [balance, setBalance] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [loadErr, setLoadErr] = useState(undefined)
    const [loginAlerting, setLoginAlerting] = useState(false)
    const [NFT, setNFT] = useState(undefined)
    const [collection, setCollection] = useState(undefined)
    const [listing, setListing] = useState(undefined)
    const [putOnMarketPlacePrice, setPutOnMarketPlacePrice] = useState(undefined)
    const [isItemOnSale, setIsItemOnSale] = useState(undefined)
    const [putOnMpErr, setPutOnMpErr] = useState(undefined)
    const [sellObj, setSellObj] = useState(undefined)
    const [updateListingPrice, setUpdateListingPrice] = useState(0)
    const [updateListingPriceErr, setUpdateListingPriceErr] = useState(undefined)
    const [updateListingPriceLoading, setUpdateListingPriceLoading] = useState(false)
    const [buyNFTModal, setBuyNFTModal] = useState(false)
    const [buyNFTLoading, setBuyNFTLoading] = useState(false)
    const [buyNFTErr, setBuyNFTErr] = useState(false)
    const [sendOfferModal, setSendOfferModal] = useState(false)
    const [startAuction, setStartAuction] = useState(false)
    const [placeAbid, setPlaceAbid] = useState(false)
    const [auctionFloor, setAuctionFloor] = useState(undefined)
    const [isOnAuction, setIsOnAuction] = useState(false)
    const [aucError, setAucError] = useState(undefined)
    const [currentAuction, setCurrentAuction] = useState(undefined)
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(undefined)
    const [offerPrice, setOfferPrice] = useState(undefined)

    var this_time = new Date(Date.now()).getTime()

    const [nearUSDT, setNearUSDT] = useState(undefined)
    useEffect(() => {
        const interval = setInterval(() => getData(), 30000);
        return () => clearInterval(interval)
    }, [])
    const getData = () => {
        let nearPrice = localStorage.getItem("nearPrice")
        setNearUSDT(nearPrice)
        return nearPrice
    }
    const nearPrice = useMemo(() => getData(), [nearUSDT]);

    const openStartAuction = () => {
        setStartAuction(true)
    }
    const openPlaceABid = () => {
        setPlaceAbid(true)
    }
    //modals
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(true);

    const [mintForAnotherModal, setMintForAnotherModal] = useState(false)
    const [mintforAnotherWalletAddress, setMintforAnotherWalletAddress] = useState(undefined)

    const [marketPlaceModal, setMarketPlaceModal] = useState(false)
    const handleMPOpen = () => setMarketPlaceModal(true);

    const [listingPriceModal, setListingModal] = useState(false)
    const handleListingOpen = () => setListingModal(true);

    const [editListingModal, setEditListingModal] = useState(false)
    const handleListEditOpen = () => setEditListingModal(true);

    const handleBuyNFTModalOpen = () => setBuyNFTModal(true);
    const handleSendOfferModalOpen = () => setSendOfferModal(true);
    const handleClose = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setOpenModal(false)
        setMarketPlaceModal(false)
        setListingModal(false)
        setEditListingModal(false)
        setBuyNFTModal(false)
        setSendOfferModal(false)
        setStartAuction(false)
        setPlaceAbid(false)
        setMintForAnotherModal(false)
        navigate(`/collections/${id.name}/assets/${id.id}`)
    };
    //end of modals
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            if (auctionApiCall.current !== undefined)
                auctionApiCall.current.cancel();
        }

    }, [])

    useEffect(() => {
        getNFT()
    }, [location])
    useEffect(() => {
        if (!userDetails || !userDetails.marketContract || !userDetails.nftContract)
            return
        getActiveAuction()

    }, [userDetails])
    useEffect(() => {
        if (userDetails && userDetails.wallet) {
            userDetails.wallet.account().getAccountBalance().then(({ available }) => setBalance(available));
            getNFTListing()
        }
    }, [userDetails])
    const getNFT = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/get/`,
                method: "post",
                body: { nft_id: id.id },
            });
            let response = await apiCall.current.promise;
            if (!response.isSuccess)
                throw response
            setLikeCount(response.data[1].likes.length)
            setNFT(response.data[1])
            setCollection(response.data[0])
        }
        catch (err) {
            if (err.status == 404)
                setLoadErr("No NFTs found.")
            else if (err.status == 500) {
                setLoadErr("Internal server error occured, please try again.")
            }
            setLoading(false)
        }
    }
    useEffect(() => {
        if (userDetails && userDetails.isLoggedIn && userDetails.userWallet && likeCount != undefined) {
            for (var i = 0; i < NFT.likes.length; i++) {
                if (NFT.likes[i] == userDetails.userWallet) {
                    setIsLiked(true)
                }
            }
        }

    }, [NFT])

    const getActiveAuction = async () => {
        try {
            auctionApiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/active/`,
                method: "post",
                body: { nft_id: id.id, }
                // body: JSON.stringify({nft_id:id.id , auction:}),
            });
            let response = await auctionApiCall.current.promise;
            if (!response.isSuccess)
                throw response
            try {
                const res = await userDetails.marketContract.get_market_data({
                    "nft_contract_id": userDetails.nftContract.contractId,
                    "token_id": id.id,
                });
                if (res && res.is_auction && parseInt(res.started_at) / 1000000 < this_time && this_time < parseInt(res.ended_at) / 1000000)
                    setIsOnAuction(true)
                // console.log(res)
            } catch (err) {
                console.log(err)
            }
            setCurrentAuction(response.data[0])
            setAuctionFloor(response.data[0].starting_price)
            if (parseInt(response.data[0].start_time) < this_time && this_time < parseInt(response.data[0].start_time) + parseInt(response.data[0].duration))
                setIsOnAuction(true)
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setAuctionFloor(undefined)
                setCurrentAuction([])
                setIsOnAuction(false)
                setIsItemOnSale(false)
            }
            else {
                setLoadErr("Internal server error occured, please try again.")
                setAucError("Internal server error occured, please try again.")
            }
        }

    }

    useEffect(() => {
        if (userDetails && userDetails.marketContract && userDetails.marketContract && NFT)
            getUsersales(NFT)

    }, [NFT, userDetails])

    useEffect(() => {
        if (!NFT || !collection || isItemOnSale === undefined) {
            return
        }
        if (!urlStatus) {
            setLoading(false)
            return
        }
        if (userDetails.userWallet.length < 5) {
            return
        }
        if (errorCode) {
            if (urlStatus && urlStatus == "create-auction") {
                setIsOnAuction(false)
                setLoading(false)
            }
            else if (urlStatus && urlStatus == "place-a-bid") {
                setLoading(false)
            }
            else if (urlStatus && urlStatus == "cancel-bid") {
                setLoading(false)
            }
            else if (urlStatus && urlStatus == "end-auction") {
                setLoading(false)
            }
            else navigate(`/collections/${id.name}/assets/${id.id}`)
        }
        else if (urlStatus && urlStatus == "accept-offer" || urlStatus == "decline-offer") {
            setValue(2)
            setLoading(false)
        }
        else if (transactionHashes) {
            switch (urlStatus) {

                case "mint":
                    if (NFT.owners.length == 0) {
                        handleOpen()
                        BitzioNftMint(NFT)
                    }
                    else {
                        let lastOwner = NFT.owners[NFT.owners.length - 1].owner_wallet_address
                        let currentUser = userDetails.userWallet
                        if (lastOwner !== currentUser) {
                            handleOpen()
                            BitzioNftMint(NFT)
                        }
                    }
                    setLoading(false)
                    break;
                case "putOnMarketPlace":
                    handleMPOpen()
                    bitzioPutOnMarketPlace(NFT, listingPriceOnContract)
                    setLoading(false)
                    break;
                case "editSale":
                    handleBitzioEditListing(NFT)
                    handleListEditOpen()
                    setLoading(false)
                    break;
                case "buyNFT":
                    handleBuyNFTModalOpen()
                    setLoading(false)
                    break;
                case "create-auction":
                    openStartAuction()
                    setLoading(false)
                    break;
                case "place-a-bid":
                    openPlaceABid()
                    setLoading(false)
                    break;
                case "end-auction":
                    EndAuctionApi()
                    // setLoading(false)
                    break;
                case "cancel-bid":
                    openPlaceABid()
                    setLoading(false)
                    break;
                case "mintForAnother":
                    if (NFT.owners.length == 0) {
                        setMintForAnotherModal(true)
                        handleBitzioMintForAnotherOne(NFT)
                    }
                    else {
                        let lastOwner = NFT.owners[NFT.owners.length - 1].owner_wallet_address
                        let currentUser = userDetails.userWallet
                        if (lastOwner !== currentUser) {
                            setMintForAnotherModal(true)
                            handleBitzioMintForAnotherOne(NFT)
                        }
                    }
                    setLoading(false)
                    break;
                case "sendOffer":
                    handleSendOfferModalOpen(true)
                    bitzioSendOffer(NFT)
                    setLoading(false)
                    break;
                default: return;
            }
        }
        else {
            switch (urlStatus) {
                case "mint":
                    handleMint(NFT, collection)
                    break;
                case "putOnMarketPlace":
                    putOnMarketplace(NFT)
                    setLoading(false)
                    break;
                case "editSale":
                    handleEditListing(NFT)
                    setLoading(false)
                    break;
                case "buyNFT":
                    handleBuyNFTModalOpen()
                    setLoading(false)
                    break;
                case "create-auction":
                    openStartAuction()
                    setLoading(false)
                    break;
                case "place-a-bid":
                    openPlaceABid()
                    setLoading(false)
                    break;
                case "cancel-bid":
                    openPlaceABid()
                    setLoading(false)
                    break;
                case "end-auction":
                    openStartAuction()
                    setLoading(false)
                    break;
                case "mintForAnother":
                    handleMintForAnotherOne(NFT, collection)
                    setLoading(false)
                    break;
                case "sendOffer":
                    handleSendOfferModalOpen(true)
                    sendOffer(NFT)
                    setLoading(false)
                    break;
                default: return;
            }
        }

    }, [NFT, collection, userDetails, location, isItemOnSale])

    const BitzioNftMint = async (nft) => {
        let username = userDetails.nftContract.account.accountId;
        let royalty = 0
        for (const item of Object.entries(nft.perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            if (key === username)
                royalty = item[1].royalty
        }

        let currentTime = Date.now().toString()
        apiCall.current = COLLECTION_API.request({
            path: '/cmd/nft/mint/',
            method: 'post',
            body: {
                tx_hash: transactionHashes,
                nft_id: nft._id.$oid,
                issued_at: currentTime,
                current_owner: username,
                owners: [JSON.stringify({
                    owner_wallet_address: username,
                    royalty: royalty
                })],
                price_history: [JSON.stringify({
                    owner_wallet_address: username,
                    price: nft.price,
                    sold_at: currentTime,
                })],
            }

        })
        const response = await apiCall.current.promise
    }

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: { md: 0, lg: 3 } }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
    function amountHandler(amount) {
        var numbered = Number(amount).toLocaleString()
        numbered = numbered.replaceAll(",", "")
        var amountInNEAR = utils.format.formatNearAmount(numbered);
        return amountInNEAR
    }
    const getNFTListing = async () => {
        try {
            const res = await userDetails.nftContract.nft_events({
                "token_id": id.id,
                // "token_id": '7346783653746' => for test,
            });
            if (res.length == 0)
                setListing([])
            else {
                let listingObj = []
                for (var i = 0; i < res.length; i++) {
                    let tmpObj = {}
                    let tmp = res[i]
                    let tmpData = tmp.data[0]
                    tmpObj.event = tmp.event
                    tmpObj.price = amountHandler(tmpData.price)
                    tmpObj.from = undefined
                    tmpObj.to = undefined
                    if (tmpObj.event == "nft_mint" || tmpObj.event == "nft_list") tmpObj.from = tmpData.owner_id
                    if (tmpObj.event == "nft_transfer") {
                        tmpObj.from = tmpData.old_owner_id
                        tmpObj.to = tmpData.new_owner_id
                    }
                    listingObj.push(tmpObj)
                }
                setListing(listingObj)
            }
        } catch (err) {
            console.log(err)
        }
    };
    const handleMint = async (NFT, collection) => {
        let storage_cost = STORAGE_COST.STORAGE_MINT_FEE
        let not_creator_mint_price = storage_cost + parseFloat(NFT.price)
        let royaltyObj = {};
        for (const item of Object.entries(NFT.perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            royaltyObj[key] = item[1].royalty * 1000;
        }
        if (collection.collection_creator === userDetails.nftContract.account.accountId)
            try {
                const res = await userDetails.nftContract.nft_creator_mint({
                    args: {
                        nfts: [
                            {
                                token_id: NFT._id.$oid,
                                metadata: {
                                    title: NFT.title,
                                    description: NFT.description,
                                    media: NFT.media,
                                    reference: NFT.reference.attributes
                                },
                                receiver_id: userDetails.nftContract.account.accountId,
                                creator_id: collection.collection_creator,
                                perpetual_royalties: royaltyObj,
                            },
                        ]

                    },
                    accountId: userDetails.nftContract.account.accountId,
                    amount: utils.format.parseNearAmount(`${storage_cost}`)
                });
            } catch (err) {
                console.log(err);
            }
        else try {
            const res = await userDetails.nftContract.nft_mint({
                args: {
                    nfts: [
                        {
                            token_id: NFT._id.$oid,
                            metadata: {
                                title: NFT.title,
                                description: NFT.description,
                                media: NFT.media,
                                reference: NFT.reference.attributes
                            },
                            receiver_id: userDetails.nftContract.account.accountId,
                            price: utils.format.parseNearAmount(NFT.price),
                            creator_id: collection.collection_creator,
                            perpetual_royalties: royaltyObj,
                        }
                    ]
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`${not_creator_mint_price}`)
            });
        } catch (err) {
            console.log(err);
        }
    };
    const bitzioPutOnMarketPlace = async (nft, listingPriceOnContract) => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/edit/`,
                method: "post",
                body:
                {
                    nft_id: nft._id.$oid,
                    current_owner: nft.current_owner,
                    title: "",
                    new_current_owner: "",
                    perpetual_royalties: "",
                    description: '',
                    extra: "",
                    reference: "",
                    expires_at: "",
                    price: listingPriceOnContract.toString(),
                    approved_account_ids: "",
                    media: "",
                    price_history: "",
                    listings: ""
                },
            });
            const res = await apiCall.current.promise
            if (!res.isSuccess) throw res
        } catch (error) {
            setPutOnMpErr(error.statusText)
        }
    }
    const putOnMarketplace = async (nft) => {
        try {
            const resp = await userDetails.nftContract.nft_approve({
                args: {
                    token_id: nft._id.$oid,
                    account_id: userDetails.marketContract.contractId,
                    msg: JSON.stringify({ price: `${utils.format.parseNearAmount(listingPriceOnContract)}`, market_type: "sale" })
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`${STORAGE_COST.STORAGE_MINT_FEE}`),
                gas: STORAGE_COST.LISTING_FEE_GAS
            });
        }
        catch (err) {
            console.log(err)
            if (err.statusText) setPutOnMpErr(err.statusText)
        }
        // else
        // alert("there's not enough storage in your wallet")
    }
    const getUsersales = async (nft) => {
        if (nft && nft.current_owner)
            try {
                const res = await userDetails.marketContract.get_sales_by_owner_id({
                    account_id: nft.current_owner,
                });
                const resp = await userDetails.marketContract.get_market_data({
                    "nft_contract_id": userDetails.nftContract.contractId,
                    "token_id": id.id,
                });
                if (resp && resp.is_auction) {
                    setIsItemOnSale(false)
                    return
                }
                if (res.length == 0) {
                    setIsItemOnSale(false)
                    return
                }
                else {
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].token_id === nft._id.$oid) {
                            setSellObj(res[i])
                            setIsItemOnSale(true)
                            setUpdateListingPrice(res[i].sell_conditions)
                            break;
                        }
                        else {
                            setIsItemOnSale(false)
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        else {
            setIsItemOnSale(false)
        }
    }
    const handleBitzioEditListing = async (nft) => {
        setUpdateListingPriceLoading(true)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/edit/`,
                method: "post",
                body: {
                    nft_id: nft._id.$oid,
                    current_owner: nft.current_owner,
                    title: "",
                    new_current_owner: "",
                    perpetual_royalties: "",
                    description: '',
                    extra: "",
                    reference: "",
                    expires_at: "",
                    price: listingPriceOnContract.toString(),
                    approved_account_ids: "",
                    media: "",
                    price_history: "",
                    listings: ""
                },
            });
            const response = await apiCall.current.promise
        } catch (error) {

        }
    }
    const handleEditListing = async (nft) => {
        setUpdateListingPriceLoading(true)
        try {
            const resp = await userDetails.marketContract.update_sale_price({
                args: {
                    nft_contract_id: userDetails.nftContract.contractId,
                    token_id: nft._id.$oid,
                    price: utils.format.parseNearAmount(updateListingPrice.toString())
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount("0.000000000000000000000001")
            });
        }
        catch (err) {
            console.log(err)
            setUpdateListingPriceErr(err.toString())
        }
    }
    const buyNFT = async (nft) => {
        let amount = utils.format.formatNearAmount(sellObj.sale_conditions)
        amount = parseFloat(amount) + STORAGE_COST.STORAGE_MINT_FEE
        try {
            const res = await userDetails.marketContract.buy({
                args: {
                    nft_contract_id: userDetails.nftContract.contractId,
                    token_id: nft._id.$oid,
                    memo: "sale"
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`${amount}`),
                gas: "200000000000000",
            });
        } catch (err) {
            console.log(err)
        }
    }
    const likeNFT = async () => {
        apiCall.current = COLLECTION_API.request({
            path: "/cmd/nft/like/",
            method: "post",
            body: {
                nft_id: NFT._id.$oid,
                wallet_address: userDetails.userWallet
            },
        })
    }
    const dislikeNFT = async () => {
        apiCall.current = COLLECTION_API.request({
            path: "/cmd/nft/unlike/",
            method: "post",
            body: {
                nft_id: NFT._id.$oid,
                wallet_address: userDetails.userWallet
            },
        })
    }


    const EndAuction = async (nft) => {
        navigate(`/collections/${id.name}/assets/${id.id}?status=end-auction`)
        try {
            const res = await userDetails.marketContract.end_auction({
                args: {
                    nft_contract_id: userDetails.nftContract.contractId,
                    token_id: nft._id.$oid,
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: "1",
                gas: "200000000000000"
            });
        } catch (err) {
            console.log(err)
            setAucError(err)
            setLoadErr(err)
        }
    }
    const EndAuctionApi = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/auc/cancel/`,
                method: "post",
                body: {
                    nft_id: id.id,
                    wallet_address: userDetails.userWallet
                },
            });
            let response = await apiCall.current.promise;
            if (!response.isSuccess)
                throw response
            setIsOnAuction(false)
            setLoading(false)
            navigate(`/collections/${id.name}/assets/${id.id}`)
        } catch (err) {
            console.log(err)
            setAucError(err)
            setLoadErr(err)
        }
    }
    const handleBitzioMintForAnotherOne = async (nft) => {
        let username = searchParams.get('toWalletAddress')
        let royalty = 0
        for (const item of Object.entries(nft.perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            if (key === username)
                royalty = item[1].royalty
        }

        let currentTime = Date.now().toString()
        apiCall.current = COLLECTION_API.request({
            path: '/cmd/nft/mint/',
            method: 'post',
            body: {
                tx_hash: transactionHashes,
                nft_id: nft._id.$oid,
                issued_at: currentTime,
                current_owner: username,
                owners: [JSON.stringify({
                    owner_wallet_address: username,
                    royalty: royalty
                })],
                price_history: [JSON.stringify({
                    owner_wallet_address: username,
                    price: nft.price,
                    sold_at: currentTime,
                })],
            }

        })
        const response = await apiCall.current.promise
    }
    const handleMintForAnotherOne = async (NFT, collection) => {
        const toWalletAddress = searchParams.get('toWalletAddress')
        let storage_cost = STORAGE_COST.STORAGE_MINT_FEE
        let not_creator_mint_price = storage_cost + parseFloat(NFT.price)
        let royaltyObj = {};
        for (const item of Object.entries(NFT.perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            royaltyObj[key] = item[1].royalty * 1000;
        }
        if (collection.collection_creator === userDetails.nftContract.account.accountId)
            try {
                const res = await userDetails.nftContract.nft_creator_mint({
                    args: {
                        nfts: [
                            {
                                token_id: NFT._id.$oid,
                                metadata: {
                                    title: NFT.title,
                                    description: NFT.description,
                                    media: NFT.media,
                                    reference: NFT.reference.attributes
                                },
                                receiver_id: toWalletAddress,
                                creator_id: collection.collection_creator,
                                perpetual_royalties: royaltyObj,
                            },
                        ]

                    },
                    accountId: userDetails.nftContract.account.accountId,
                    amount: utils.format.parseNearAmount(`${storage_cost}`)
                });
            } catch (err) {
                console.log(err);
            }
        else try {
            const res = await userDetails.nftContract.nft_mint({
                args: {
                    nfts: [
                        {
                            token_id: NFT._id.$oid,
                            metadata: {
                                title: NFT.title,
                                description: NFT.description,
                                media: NFT.media,
                                reference: NFT.reference.attributes
                            },
                            receiver_id: toWalletAddress,
                            price: utils.format.parseNearAmount(NFT.price),
                            creator_id: collection.collection_creator,
                            perpetual_royalties: royaltyObj,
                        }
                    ]
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`${not_creator_mint_price}`)
            });
        } catch (err) {
            console.log(err);
        }
    }
    const sendOffer = async (nft) => {
        let pr = offerPrice.toString()
        const res = await userDetails.marketContract.add_offer({
            args: {
                token_id: nft._id.$oid,
                nft_contract_id: userDetails.nftContract.contractId,
                price: utils.format.parseNearAmount(pr),
            },
            accountId: userDetails.userWallet,
            amount: utils.format.parseNearAmount(pr)
            // depositYocto: "1000000000000000000000000"
        });
    }
    const bitzioSendOffer = async (nft) => {
        let _offerPrice = searchParams.get('offerPrice')

        try {
            apiCall.current = COLLECTION_API.request({
                path: "/cmd/nft/offer/",
                method: "post",
                body: {
                    nft_id: nft._id.$oid,
                    from_wallet_address: userDetails.userWallet,
                    offer: [{ price: _offerPrice }]
                }
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess)
                throw response
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <Box
            className='container'>
            {loginAlerting == false ?
                <div>
                    {loading ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", minHeight: "90vh" }}>
                            <LoadingComponent
                                isGrid={false}
                                ColNumber={1}
                                responsiveColNumber={1}
                                elementType={"rounded"}
                                elementWidth={"100%"}
                                elementHeight="500px"
                                responsiveElementWidth="100%"
                                responsiveElementHeight="70vh"
                                elementCount={1}
                                responsiveCount={1}
                            />
                        </Box>
                        :
                        loadErr ? <Typography sx={{ color: 'red' }}>{loadErr}</Typography> :
                            <Box className="row" sx={{ backgroundColor: '#3a3d4d', borderRadius: ' 15px', margin: '30px 0px', overflow: 'hidden', minHeight: '80vh' }}>
                                <Box className="col-12 col-lg-6 "
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: { xs: '40vh', lg: "80vh" }
                                    }}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        backgroundImage: BG_URL(`${NFT.media}`),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '100%',
                                        filter: 'blur(50px)',
                                        borderRadius: ' 15px',

                                    }} />
                                    <Box sx={{
                                        width: '80% ',
                                        height: '80% ',
                                        backgroundImage: BG_URL(`${NFT.media}`),
                                        position: 'absolute',
                                        zIndex: '1',
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: "no-repeat",
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%,-50%)'

                                    }} />
                                </Box>
                                <Box className="col-12 col-lg-6" sx={{ height: 'auto' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', margin: 2 }}>
                                        <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column' }}>
                                            <h2>{NFT.title}</h2>
                                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                <div>by&nbsp;</div>
                                                <Link style={{ textDecoration: "none", color: theme.pallete.lightBlue, verticalAlign: "center", "&:hover": { textDecoration: "underline" } }} to={`/creator/${collection.collection_creator}`}><div>{collection.collection_creator}</div></Link>
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: "column", alignItems: 'center', textAlign: 'center' }}>
                                            <div>
                                                {isLiked ?
                                                    <FavoriteIcon onClick={() => {
                                                        setIsLiked(false)
                                                        setLikeCount(likeCount - 1)
                                                        dislikeNFT()
                                                    }} sx={{ fontSize: '30px', cursor: 'pointer', color: 'red' }} />
                                                    :
                                                    <FavoriteBorderOutlinedIcon onClick={() => {
                                                        setIsLiked(true)
                                                        setLikeCount(likeCount + 1)
                                                        likeNFT()
                                                    }} sx={{ fontSize: '30px', cursor: 'pointer', }} />
                                                }
                                            </div>
                                            <div>
                                                {likeCount}
                                            </div>
                                        </Box>
                                    </Box>

                                    <div className='nftLongInfo nft-single-accardeon-wrapper'>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <Tabs value={value} onChange={handleChange} sx={{ flex: '1 !important' }}>
                                                <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Info</Typography> </Box>} />
                                                <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Owners</Typography> </Box>} />
                                                <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Offers</Typography> </Box>} />
                                                <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>History</Typography> </Box>} />
                                                <Tab label={<Box><Typography sx={{ margin: '1px 0px' }}>Auction</Typography> </Box>} />
                                            </Tabs>
                                        </Box>
                                        <Box>
                                            <TabPanel value={value} index={0}>
                                                <InfoTab collection={collection} nft={NFT} />
                                            </TabPanel>
                                            <TabPanel value={value} index={1}>
                                                <OwnersTab nft={NFT} />
                                            </TabPanel>
                                            <TabPanel value={value} index={2}>
                                                <OffersTab errorCode={errorCode} location={location} urlStatus={urlStatus} transactionHashes={transactionHashes} nft={NFT} user={userDetails && userDetails.userWallet ? userDetails : undefined} collection={collection} />
                                            </TabPanel>
                                            <TabPanel value={value} index={3}>
                                                <NftHistory listings={listing} />
                                            </TabPanel>
                                            <TabPanel value={value} index={4}>
                                                <AuctionTab nftId={id.id} auction={currentAuction} />
                                            </TabPanel>
                                        </Box>
                                        {userDetails && userDetails.userWallet ?
                                            <Box className="text-center" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: "1fr 1fr " }, justifyContent: 'space-evenly', padding: "10px 20px" }}>
                                                {NFT.owners.length == 0 ?
                                                    <>
                                                        <TxtButton
                                                            text="Mint"
                                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                            borderColor="rgba(27, 127, 153, 1)"
                                                            fontSize="12px"
                                                            onClick={() => navigate(`/collections/${id.name}/assets/${id.id}?status=mint`)}
                                                            width="95%"
                                                            displayType="inline-block"
                                                        />
                                                        <TxtButton
                                                            text="Mint for another user"
                                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                            borderColor="rgba(27, 127, 153, 1)"
                                                            fontSize="12px"
                                                            onClick={() => setMintForAnotherModal(true)}
                                                            width="95%"
                                                            displayType="inline-block"
                                                        />
                                                    </>
                                                    : NFT.current_owner != userDetails.userWallet ? <TxtButton
                                                        text={`Send offer to owner`}
                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                        borderColor="rgba(27, 127, 153, 1)"
                                                        fontSize="12px"
                                                        width="95%"
                                                        onClick={handleSendOfferModalOpen}
                                                    /> : undefined
                                                }
                                                {isOnAuction ? undefined : <>
                                                    {NFT.current_owner == userDetails.userWallet ?
                                                        <>
                                                            {isItemOnSale ?
                                                                <> <TxtButton
                                                                    text={`Item listed for ${utils.format.formatNearAmount(sellObj.sale_conditions)} Ⓝ. Tap to edit`}
                                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                    borderColor="rgba(27, 127, 153, 1)"
                                                                    fontSize="12px"
                                                                    width="95%"
                                                                    onClick={() => handleListEditOpen()}
                                                                />
                                                                    <TxtButton
                                                                        text="Start Auction on Item"
                                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                        borderColor="rgba(27, 127, 153, 1)"
                                                                        onClick={openStartAuction}
                                                                        // onClick={() => EndAuction(NFT)}
                                                                        fontSize="12px"
                                                                        width="95%"
                                                                    />
                                                                </> :
                                                                <>
                                                                    <TxtButton
                                                                        text="Put on marketplace"
                                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                        borderColor="rgba(27, 127, 153, 1)"
                                                                        onClick={() => handleListingOpen()}
                                                                        fontSize="12px"
                                                                        width="95%"
                                                                    />
                                                                    <TxtButton
                                                                        text="Start Auction on Item"
                                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                        borderColor="rgba(27, 127, 153, 1)"
                                                                        onClick={openStartAuction}
                                                                        // onClick={() => EndAuction(NFT)}
                                                                        fontSize="12px"
                                                                        width="95%"
                                                                    />
                                                                </>
                                                            }

                                                        </>
                                                        :
                                                        <>
                                                            {isItemOnSale ?
                                                                <>
                                                                    <TxtButton
                                                                        text={`Buy for ${utils.format.formatNearAmount(sellObj.sale_conditions)}Ⓝ`}
                                                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                        borderColor="rgba(27, 127, 153, 1)"
                                                                        fontSize="12px"
                                                                        width="95%"
                                                                        onClick={() => navigate(`/collections/${id.name}/assets/${id.id}?status=buyNFT`)}
                                                                    />
                                                                    {/* <TxtButton
                                                                    text={`Send offer to owner`}
                                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                                    borderColor="rgba(27, 127, 153, 1)"
                                                                    fontSize="12px"
                                                                    width="95%"
                                                                    onClick={handleSendOfferModalOpen}
                                                                /> */}
                                                                </>
                                                                :
                                                                undefined
                                                            }
                                                        </>
                                                    }</>}
                                                {isOnAuction && userDetails && userDetails.userWallet && userDetails.userWallet !== NFT.current_owner ? <TxtButton
                                                    text={`Place a bid`}
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)"
                                                    fontSize="12px"
                                                    width="95%"
                                                    onClick={openPlaceABid}
                                                />
                                                    : undefined
                                                }
                                                {isOnAuction && userDetails && userDetails.userWallet && userDetails.userWallet == NFT.current_owner ? <TxtButton
                                                    text={`End Auction`}
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)"
                                                    fontSize="12px"
                                                    width="95%"
                                                    onClick={() => EndAuction(NFT)}
                                                />
                                                    : undefined
                                                }
                                                <MintModal open={openModal} onClose={handleClose} NFT={NFT} transactionHashes={transactionHashes} />
                                                {/* modal for success listing */}
                                                <PutOnMarketPlaceModal open={marketPlaceModal} onClose={handleClose} NFT={NFT} transactionHashes={transactionHashes} />
                                                {/* modal for seting price and list */}
                                                <ListingPriceModal
                                                    open={listingPriceModal}
                                                    onClose={handleClose}
                                                    putOnMarketPlacePrice={putOnMarketPlacePrice}
                                                    onChange={(e) => setPutOnMarketPlacePrice(e.target.value)}
                                                    balance={balance}
                                                    onClick={() => navigate(`/collections/${id.name}/assets/${id.id}?status=putOnMarketPlace&price=${putOnMarketPlacePrice}`)}
                                                    err={putOnMpErr}
                                                />
                                                {/* modal for edit listing */}
                                                <EditListingModal
                                                    open={editListingModal}
                                                    onClose={handleClose}
                                                    listingPrice={updateListingPrice}
                                                    onChange={(e) => setUpdateListingPrice(e.target.value)}
                                                    err={updateListingPriceErr}
                                                    transactionHashes={transactionHashes}
                                                    onClick={() => navigate(`/collections/${id.name}/assets/${id.id}?status=editSale&price=${updateListingPrice}`)}
                                                    loading={updateListingPriceLoading}
                                                />
                                                <BuyNFTModal
                                                    open={buyNFTModal}
                                                    onClose={handleClose}
                                                    NFT={NFT}
                                                    price={sellObj ? sellObj.sale_conditions : undefined}
                                                    transactionHashes={transactionHashes}
                                                    err={buyNFTErr}
                                                    loading={buyNFTLoading}
                                                    onClick={() => buyNFT(NFT)}
                                                    user={userDetails}
                                                    urlStatus={urlStatus}
                                                />
                                                <SendOfferModal
                                                    userDetails={userDetails}
                                                    open={sendOfferModal}
                                                    onClose={handleClose}
                                                    nft={NFT}
                                                    balance={balance}
                                                    userWallet={userDetails.userWallet}
                                                    offerPrice={offerPrice}
                                                    setOfferPrice={setOfferPrice}
                                                />
                                                <StartAuctionModal open={startAuction} onClose={handleClose} auction={currentAuction} aucError={aucError} currentOwner={NFT.current_owner} />
                                                <PlaceBidModal open={placeAbid} onClose={handleClose} floor={auctionFloor} auction={currentAuction} aucError={aucError} currentOwner={NFT.current_owner} />
                                                <MintForAnotherModal
                                                    open={mintForAnotherModal}
                                                    onClose={handleClose}
                                                    NFT={NFT}
                                                    transactionHashes={transactionHashes}
                                                    state={mintforAnotherWalletAddress}
                                                    onChange={(e) => { setMintforAnotherWalletAddress(e.target.value) }}
                                                    handleSubmit={() => navigate(`/collections/${id.name}/assets/${id.id}?status=mintForAnother&toWalletAddress=${mintforAnotherWalletAddress}`)} />

                                            </Box>
                                            :
                                            <Box className="text-center"
                                            // sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: "1fr 1fr " }, justifyContent: 'space-evenly', padding: "10px 20px" }}
                                            >
                                                <Typography sx={{ textAlign: 'center', color: theme.pallete.lightBlue, marginTop: '20px' }}>Log in to perform actions</Typography>
                                            </Box >
                                        }
                                    </div>
                                </Box>
                            </Box>
                    }
                </div >
                :
                <div>
                    <LoginAlert />
                </div>
            }

        </Box >

    )
}