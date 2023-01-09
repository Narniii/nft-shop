import { CircularProgress, Modal, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { BG_URL, PUBLIC_URL } from '../../../utils/utils'
import '../CollectionSingle/CollectionSingle.css'
import Box from '@mui/material/Box';
import { API_CONFIG, STORAGE_COST } from '../../../config'
import { COLLECTION_API } from '../../../data/collection_api'
import InfoCards from '../CollectionSingle/InfoCards'
import SocialRow from '../CollectionSingle/SocialRow'
import CardWithBordersAndBgColor from '../../../components/CardWithBordersAndBgColor'
import CardWithTitle from '../../../components/CardWithTitle'
import TxtButton from '../../../components/TxtButton'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { utils } from "near-api-js";
// import Countdown from 'react-countdown';
import MintModal from './MintModal';
import InputTitles from '../../../components/InputTitles';

export default function MintHere() {
    const theme = useTheme()
    const userDetails = useSelector(state => state.userReducer)
    let [searchParams, setSearchParams] = useSearchParams();
    const apiCall = useRef(undefined)
    const navigate = useNavigate();
    const location = useLocation();
    const nftsApiCall = useRef(undefined)
    const id = useParams()
    const [value, setValue] = React.useState(0);
    const urlStatus = searchParams.get('status')
    const transactionHashes = searchParams.get('transactionHashes')
    const errorCode = searchParams.get('errorCode')
    const nftId = searchParams.get('nft')
    const [mintCount, setMintCount] = useState(undefined)
    const [preErr, setPreErr] = useState(undefined)
    const example =
        `
    {
        "nft_metadata":   
        [
            {
                "title": "title one",
                "extra": [{"name":"example","value":"example","rarity":20,"example":"example"}],
                "media":"https://bafkreibzssk7zti3ajsd7ydkjfh6sdf8u7yppm4o2sjt3zvisswr3nwre.ipfs.nftstorage.link/",
                "description":"nft descriptopn"
            },
            {
                "title": "title two",
                "extra": [{"name":"example1","value":"example","rarity":20}],
                "description":"nft description",
                "media":"https://bafkreica63gdw6qsmkohptdtkusdhf88dcaj4nczp7sdjrjnszzyblbz4y.ipfs.nftstorage.link/"
            },
            .
            .
            .
        ]
    }
        `
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    const [collection, setCollection] = React.useState(undefined)
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState(undefined)
    const [minters, setMinters] = useState(undefined)
    const [openModal, setOpenModal] = useState(false);
    const [open, setOpen] = useState(false)
    const mintApi = useRef(undefined)
    const [mintApiLoading, setMintApiLoading] = useState(undefined)
    const [mintApiErr, setMintApiErr] = useState(undefined)
    const [mintApiSuccess, setMintApiSuccess] = useState(undefined)
    const [modalLoading, setModalLoading] = useState(true)
    const [modalErr, setModalErr] = useState(undefined)
    const ModalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: theme.pallete.darkBox,
        border: `2px solid ${theme.pallete.lightBorder}`,
        width: { xs: "90%", md: "50%", lg: "40%" },
        boxShadow: 24,
        p: 2,
        outline: 0,
        borderRadius: '5px',
        fontSize: '14px'
    };
    const [files, setFiles] = useState("");
    const [mintButton, setMintButton] = useState(false)
    const handleJSONChange = e => {
        setFiles(e.target.files[0])
    };
    const handleOpen = () => setOpenModal(true);
    const handleClose = (event, reason) => {
        if (reason && reason == "backdropClick")
            return;
        setOpenModal(false)
        navigate(`/mint-calendar/collection/${id.id}`)
    };
    useEffect(() => {
        // getNFTs()
        getCollection()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            // if (nftsApiCall.current !== undefined)
            //   nftsApiCall.current.cancel();
        }
    }, [location])

    const getCollection = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/get/mint/`,
                method: "post",
                body: { collection_id: id.id },
            });
            let resp = await apiCall.current.promise;
            console.log(resp)
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/get/`,
                method: "post",
                body: { collection_id: id.id },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            if (parseInt(response.data.nft_mint[0].start_mint) < this_time && this_time < parseInt(response.data.nft_mint[0].stop_mint))
                setMintButton(true)
            let _minters = []
            let mintedIds = []
            if (resp.status == 404) {
                setCollection(response.data)
                setMinters([])
            }
            else {
                for (var i = 0; i < resp.data.length; i++) {
                    mintedIds.push(resp.data[i]._id.$oid)
                    _minters.push(resp.data[i].current_owner)
                    for (var j = 0; j < response.data.nft_ids.length; j++) {
                        if (response.data.nft_ids[j] == resp.data[i]._id.$oid) {
                            response.data.nft_ids.splice(j, 1)
                        }
                    }
                }
                setCollection(response.data)
                setMinters(_minters)
            }
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setErrMsg("No such collection found.")
            }
            else {
                setErrMsg("We're sorry , something is wrong with the server. Please try again later. Will be fixed asap")
            }

        }
    }
    useEffect(() => {
        if (!collection) {
            return
        }
        setLoading(false)
        if (!urlStatus) {
            setLoading(false)
            return
        }
        if (userDetails.userWallet.length < 5) {
            return
        }
        if (errorCode) navigate(`/mint-calendar/collection/${id.id}`)
        else if (transactionHashes && urlStatus == "mint") {
            handleOpen()
            handleBitzioMint()
            setLoading(false)
        }
        else if (!transactionHashes && urlStatus == "mint") {
            handleMint()
        }

    }, [collection, location, userDetails])

    const handleBitzioMint = async () => {
        let _item = localStorage.getItem("ItemToMint")
        _item = JSON.parse(_item)
        setMintCount(_item.randomIds.length)
        var successCount = 0
        let username = userDetails.nftContract.account.accountId;
        let currentTime = Date.now().toString()
        let royalty = 0

        for (const item of Object.entries(collection.default_perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            if (key === username)
                royalty = item[1].royalty
        }

        for (var k = 0; k < _item.randomIds.length; k++) {
            try {
                apiCall.current = COLLECTION_API.request({
                    path: '/cmd/nft/mint/',
                    method: 'post',
                    body: {
                        tx_hash: transactionHashes,
                        nft_id: _item.randomIds[k],
                        issued_at: currentTime,
                        current_owner: username,
                        owners: [JSON.stringify({
                            owner_wallet_address: username,
                            royalty: royalty
                        })],
                        price_history: [JSON.stringify({
                            owner_wallet_address: username,
                            price: collection.reveal[0].start_mint_price,
                            sold_at: currentTime,
                        })],
                    }

                })
                const response = await apiCall.current.promise
                console.log(response)
                if (!response.isSuccess) throw response
                successCount++
            } catch (error) {
                console.log(error)
                setModalErr(true)
                setModalLoading(false)
                return
            }
        }
        if (successCount == _item.randomIds.length) {
            setModalLoading(false)
            setModalErr(undefined)
            localStorage.removeItem("ItemToMint")
        }

    }
    const handleMint = async () => {
        var items = await localStorage.getItem("ItemToMint")
        items = JSON.parse(items)
        let _itemsForNotCreator = []
        let _itemsForCreator = []
        let storage_cost = STORAGE_COST.STORAGE_MINT_FEE * items.randomIds.length
        let not_creator_mint_price = (storage_cost * items.randomIds.length) + (parseFloat((collection.reveal[0].start_mint_price * items.randomIds.length)))
        let royaltyObj = {};
        for (const item of Object.entries(collection.default_perpetual_royalties)) {
            const key = `${item[1].wallet_address}`;
            royaltyObj[key] = item[1].royalty * 1000;
        }

        for (var z = 0; z < items.randomIds.length; z++) {
            _itemsForNotCreator.push({
                token_id: items.randomIds[z],
                metadata: {
                    title: "???",
                    description: "???",
                    media: collection.reveal[0].reveal_link,
                    reference: ""
                },
                receiver_id: userDetails.nftContract.account.accountId,
                price: utils.format.parseNearAmount(collection.reveal[0].start_mint_price),
                creator_id: collection.creator,
                perpetual_royalties: royaltyObj,
            })
        }
        for (var k = 0; k < items.randomIds.length; k++) {
            _itemsForCreator.push({
                token_id: items.randomIds[k],
                metadata: {
                    title: "???",
                    description: "???",
                    media: collection.reveal[0].reveal_link,
                    reference: ""
                },
                receiver_id: userDetails.nftContract.account.accountId,
                creator_id: collection.creator,
                perpetual_royalties: royaltyObj,
            })
        }
        if (collection.creator === userDetails.nftContract.account.accountId)
            try {
                const res = await userDetails.nftContract.nft_creator_mint({
                    args: {
                        nfts: _itemsForCreator
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
                    nfts: _itemsForNotCreator
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`${not_creator_mint_price}`)
            });
        } catch (err) {
            console.log(err);
        }
    };
    const handleJSONSubmit = async () => {
        setMintApiLoading(true)
        const formData = new FormData()
        formData.append("collection_id", collection._id.$oid)
        formData.append("metadata", files)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/add/meta/`,
                method: "post",
                body: formData,
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setMintApiSuccess('File submited successfully.')
            setMintApiLoading(false)
            setMintApiErr(undefined)
        }
        catch (err) {
            console.log(err)
            setMintApiLoading(false)
            setMintApiErr("Failed to submit")
            setMintApiSuccess(undefined)

        }
    }
    const this_time = parseInt(new Date(Date.now()).getTime())

    const [count_down, setCount_down] = useState(undefined)
    const theInterval = useRef(null)

    const CountDown = () => {
        var difference;
        var q;
        if (collection)
            switch (true) {
                case (this_time < parseInt(collection.nft_mint[0].start_mint)):
                    theInterval.current = setInterval(function () {
                        var thisTime = parseInt(new Date(Date.now()).getTime())
                        difference = Math.abs(parseInt(collection.nft_mint[0].start_mint) - thisTime)
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to start"
                        var days = Math.floor(difference / (24 * 60 * 60 * 1000));
                        var hours = hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                        var minutes = Math.floor((difference / (1000 * 60)) % 60);
                        var seconds = Math.floor((difference / 1000) % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to start"
                    break;
                case (parseInt(collection.nft_mint[0].start_mint) < this_time && this_time < parseInt(collection.nft_mint[0].stop_mint)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(parseInt(collection.nft_mint[0].stop_mint) - thisTime)
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to finish"
                        var days = Math.floor(difference / (24 * 60 * 60 * 1000));
                        var hours = hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                        var minutes = Math.floor((difference / (1000 * 60)) % 60);
                        var seconds = Math.floor((difference / 1000) % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to finish"
                    break;
                case (parseInt(collection.nft_mint[0].stop_mint) < this_time && parseInt(collection.nft_mint[0].start_mint) < this_time):
                    setCount_down("-- : -- : -- : --")
                    q = " minting time is expired "
                    break;
                default:
                    setCount_down("-- : -- : -- : --")
                    q = " "
                    break;
            }
        useEffect(() => {
            if (count_down != undefined) {
                return () => {
                    if (theInterval.current)
                        clearInterval(theInterval.current);
                };
            }
        }, [count_down])
        return (
            <>
                {count_down != undefined ?
                    <div className="col text-center">
                        <p style={{ color: "orange" }}>{count_down}</p>
                        <p style={{ color: "orange" }}>{q}</p>
                    </div>
                    : undefined}
            </>
        )
    }
    const handlePreSubmit = async (e) => {
        e.preventDefault()
        setPreErr(undefined)
        if (collection.mint_per_wallet[0].limitable === true) {
            if (parseInt(mintCount) > parseInt(collection.mint_per_wallet[0].mint_count)) {
                setPreErr(`Users can't have more than ${collection.mint_per_wallet[0].mint_count} NFTs of this collection`)
                return
            }
            apiCall.current = COLLECTION_API.request({
                method: "post",
                path: "/cmd/nft/mint/check/",
                body: {
                    mint_count: mintCount,
                    collection_id: id.id,
                    wallet_address: userDetails.userWallet
                }
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess) {
                setPreErr(`Users can't have more than ${collection.mint_per_wallet[0].mint_count} NFTs of this collection`)
                return
            }
        }
        var localStorageObj = {}
        var randomIds = []
        var ids = [...collection.nft_ids]
        if (mintCount == undefined || mintCount == 0 || mintCount > ids.length) {
            setPreErr("Define mint count properly")
            return
        }

        for (var i = 0; i < mintCount; i++) {
            console.log("ids length:", ids.length)
            var randomIndex = Math.floor(Math.random() * ids.length);
            var randomID = ids[randomIndex]
            randomIds.push(randomID)
            ids = ids.filter(id => id !== randomID);
        }
        localStorageObj.collection = collection._id.$oid
        localStorageObj.randomIds = randomIds
        localStorage.setItem("ItemToMint", JSON.stringify(localStorageObj))
        navigate(`/mint-calendar/collection/${id.id}?status=mint`)
    }
    return (
        <>
            {errMsg ? <Box sx={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><p style={{ color: "orange", marginTop: "40px" }}>{errMsg}</p></Box> :
                <section>
                    {loading ?
                        <Box sx={{ minHeight: "40vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ color: theme.pallete.lightBlue }}>Loading...</Typography>
                        </Box>
                        :
                        <>
                            <div className='collection-banner' style={{ backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.banner_image_path}`)) }}>
                                <div className='collection-thumbnail'>
                                    <div className='collection-thumbnail-image' style={{ backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.COLLECTIONS_API_URL}${collection.logo_path}`)) }} ></div>
                                </div>
                            </div>
                            <Typography variant='h1' sx={{ marginTop: 10, marginBottom: 5, textAlign: 'center', fontWeight: 'bold' }}>{collection.title}</Typography>
                            <Typography variant='h5' sx={{ textAlign: 'center' }}>Created by <Link to={`/creator/${collection.creator}`} style={{ textDecoration: 'none' }}>{collection.creator}</Link></Typography>

                            <SocialRow links={collection.extra} />
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, justifyContent: 'space-evenly', width: { xs: '90%', sm: '95%', md: '70%' }, margin: '0 auto' }}>
                                <InfoCards title="Available items" content={collection.nft_ids.length} />
                                <InfoCards title="minting time" content={collection.reveal[0].is_revealed ? <p style={{ color: "orange" }}>expired</p> : <CountDown />} />
                                <InfoCards title="Floor price" content={`${collection.reveal[0].start_mint_price} Ⓝ`} />
                                {/* <InfoCards title="Traded" content={Math.floor(Math.random() * 100)} /> */}
                            </Box>
                            {
                                userDetails.userWallet == collection.creator ?
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <TxtButton
                                            text="Upload JSON file"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            onClick={() => setOpen(true)}
                                            fontSize="12px"
                                            width="40%"
                                        />
                                    </Box>
                                    :
                                    undefined
                            }
                            {
                                userDetails.userWallet == collection.creator && parseInt(collection.nft_mint[0].stop_mint) > this_time ?
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <TxtButton
                                            text="Reveal now"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            onClick={() => alert("we can reveal before minting time expiration with this(coming soon)")}
                                            fontSize="12px"
                                            width="40%"
                                        />
                                    </Box>
                                    :
                                    undefined
                            }
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, justifyContent: 'space-evenly', width: { xs: '90%', sm: '95%', md: '70%' }, margin: '50px auto' }}>
                                <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                    <Box sx={{
                                        backgroundImage: BG_URL(PUBLIC_URL(collection.reveal[0].reveal_link)),
                                        height: { xs: '150px', sm: '200px', md: '250px' },
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        margin: '10px',
                                        borderRadius: '15px',
                                    }} />
                                    <CardWithTitle title={`${collection.title}`} marginTop="40px" width="90%" fontSize="16px" responsiveFontSize="12px">
                                        <div className="text-center">
                                            {/* <div className="col-5">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ margin: '5px' }}><FavoriteBorderIcon sx={{ fontSize: 30 }} /></span>
                                                    <span>{Math.floor(Math.random() * 100)}</span>
                                                </div>
                                            </div> */}
                                            <div className="col-12">
                                                <div>Price</div>
                                                <div>
                                                    <span>{collection.reveal[0].start_mint_price} Ⓝ</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardWithTitle>
                                    {userDetails.isLoggedIn == false || !userDetails.nftContract.account.accountId ?
                                        <Typography sx={{ textAlign: 'center', color: theme.pallete.lightBlue, margin: '20px 0px' }}>You must login to mint NFT</Typography> :
                                        collection.nft_ids.length == 0 ?
                                            <Typography sx={{ textAlign: 'center', color: theme.pallete.lightBlue, margin: '20px 0px' }}>All NFTs are minted</Typography> :
                                            <div className="text-center" style={{ margin: '20px 0px' }}>
                                                {mintButton ?
                                                    <Box
                                                        sx={{ display: 'flex', justifyContent: "center" }}>
                                                        <input style={{
                                                            diaply: 'inline-block',
                                                            height: '50px',
                                                            width: '250px',
                                                            background: 'transparent',
                                                            color: "white",
                                                            border: `1px solid ${theme.pallete.lightBorder}`,
                                                            marginTop: '5px',
                                                            marginRight: '5px'
                                                        }}
                                                            onWheel={(e) => e.target.blur()}
                                                            onChange={(e) => { setMintCount(e.target.value) }}
                                                            type="number"
                                                            className="form-control" placeholder="Number of NFTs to mint" />
                                                        <TxtButton text="Mint" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"}
                                                            onClick={(e) => { handlePreSubmit(e) }}
                                                        />
                                                    </Box>
                                                    : undefined}
                                                {preErr ? <p style={{ color: "red", margin: "10px" }}>{preErr}</p> : undefined}
                                            </div>
                                    }
                                </CardWithBordersAndBgColor>
                                <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)">
                                    <div style={{ margin: '10px', display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                                        <h4>description:</h4>
                                        <Typography variant='h6' sx={{ textAlign: 'justify' }}>{collection.description}
                                        </Typography>
                                    </div>
                                </CardWithBordersAndBgColor>
                            </Box>
                            <MintModal open={openModal} onClose={handleClose} collection={collection} transactionHashes={transactionHashes} count={mintCount} err={modalErr} loading={modalLoading} />
                        </>
                    }
                    <Modal
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={ModalStyle}>
                            {
                                collection && userDetails && userDetails.userWallet && userDetails.userWallet == collection.creator ?
                                    <>
                                        <InputTitles title="JSON file" variant="h2" isBold={true} marginTop="40px" explanation="Upload JSON file including all NFTs details." />
                                        <input type="file" onChange={handleJSONChange} />
                                    </>
                                    :
                                    undefined
                            }
                            <Box sx={{ margin: "20px 0px", borderBottom: "1px solid lightblue", borderTop: "1px solid lightblue" }}>
                                <Typography sx={{ fontSize: "11px", marginTop: "10px" }}>uploaded metadata should be of this format:</Typography>
                                <Typography sx={{ fontSize: "11px", color: "lightblue", marginTop: "5px" }}>
                                    <span style={{ borderBottom: "1px solid lightblue" }}>
                                        "example.json" :
                                    </span>
                                    <pre>
                                        <code style={{ color: "cyan" }}>
                                            {example}
                                        </code>
                                    </pre>
                                </Typography>
                            </Box>
                            {mintApiLoading ?
                                <TxtButton
                                    text={<CircularProgress />}
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    fontSize="12px"
                                    width="40%"
                                /> :
                                <TxtButton
                                    text="Submit"
                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                    borderColor="rgba(27, 127, 153, 1)"
                                    onClick={handleJSONSubmit}
                                    fontSize="12px"
                                    width="40%"
                                />
                            }
                            {mintApiErr ? <Typography variant='h5' sx={{ margin: 3, textAlign: 'center', color: 'red' }}>{mintApiErr}</Typography> : undefined}
                            {mintApiSuccess ? <Typography variant='h5' sx={{ margin: 3, textAlign: 'center', color: 'green' }}>{mintApiSuccess}</Typography> : undefined}
                        </Box>
                    </Modal >
                </section >
            }
        </>
    )
}
