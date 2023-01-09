
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState, useContext } from 'react';
import CustomTitle from '../../components/CustomTitle'
import InputTitles from '../../components/InputTitles'
import TxtButton from '../../components/TxtButton'
import { PUBLIC_URL } from '../../utils/utils'
import './NFT.css'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { API_CONFIG, NFT_STORAGE_API_KEY } from '../../config';
import axios from 'axios'
import LoginAlert from '../../components/LoginAlert';
import { useSelector } from 'react-redux';
import { utils } from "near-api-js";
import GenerateRandomCode from "react-random-code-generator";

export default function CreateNFTBackup() {

    const userDetails = useSelector(state => state.userReducer)
    const [nft, setNft] = useState({
        img: undefined,
        name: '',
        description: '',
        collection: -1,
        royalty: '',
        // supply: '',
        // price: ''
    })
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [collectionErr, setCollectionErr] = useState(undefined)
    const theme = useTheme()
    const [fetchedCollections, setFetchedCollections] = useState([])
    const [imageChanged, setImageChanged] = useState(false)
    const [fetchedNftFromContract, setFetchedNftFromContract] = useState(undefined)
    useEffect(() => {
        if (userDetails.isLoggedIn) {
            const nftId = localStorage.getItem("newly created nft id")
            console.log(nftId)
            if (nftId) {
                fetchNftFromContract(nftId)
                console.log('in if')
            }
            else {
                fetchCollections()
                console.log('in else')
            }
        }
    }, [userDetails])

    const onChange = e => {
        var n = { ...nft };
        n[e.target.name] = e.target.value;
        setNft(n);
    }

    const handleFile = (e) => {
        var n = { ...nft };
        n.img = e.target.files[0];
        setNft(n);
        setImageChanged(true)
        var image = document.getElementById('output');
        if (e.target.files[0]) {
            const fileReader = new FileReader();
            var formId = document.getElementById("formId")
            fileReader.readAsDataURL(e.target.files[0]);
            fileReader.addEventListener("load", function () {
                document.getElementById('output').src = this.result
            });
        }
    }
    useEffect(() => {
        if (fetchedNftFromContract) {
            handleSubmit()
        }
    }, [fetchedNftFromContract])
    const handleSubmit = async (e) => {
        console.log(fetchedNftFromContract)
        let perpetual_royalties = []
        var size = Object.keys(fetchedNftFromContract.royalty).length;
        for (var i = 0; i < size; i++) {
            let key = Object.keys(fetchedNftFromContract.royalty)[i]
            let value = fetchedNftFromContract.royalty[key]
            let tmpObj = {
                wallet_address: key,
                royalty: value
            }
            perpetual_royalties.push(tmpObj)
        }
        let collectionID = await JSON.parse(fetchedNftFromContract.metadata.extra).collection_id
        console.log(collectionID)
        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/nft/create/`,
                data: {
                    collection_id: collectionID,
                    title: fetchedNftFromContract.metadata.title,
                    description: fetchedNftFromContract.metadata.description,
                    extra: JSON.stringify({}),
                    issued_at: `${Date.now()}`,
                    reference: JSON.stringify({}),
                    expires_at: `${Date.now()}`,
                    price: 0,
                    approved_account_ids: JSON.stringify({}),
                    current_owner: fetchedNftFromContract.owner_id,
                    owners: [{
                        owner_walletaddress: fetchedNftFromContract.owner_id,
                        royalty: fetchedNftFromContract.royalty[fetchedNftFromContract.owner_id]
                    }],
                    media: fetchedNftFromContract.metadata.media,
                    perpetual_royalties: perpetual_royalties
                }
            });
            if (response.status == 201) {
                setSuccessMesssage("NFT created successfully")
                setApiLoading(false)

            }
        }
        catch (err) {
            console.log(err)
            setErr(err.response.data.message)
            setApiLoading(false)
        }
    }
    const ipfsUpload = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `https://api.nft.storage/upload`,
                data: nft.img,
                headers: {
                    "Authorization": `Bearer ${NFT_STORAGE_API_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if (response.status == 200) {
                return response.data.value.cid
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const fetchCollections = async () => {
        const formData = new FormData();
        formData.append("user_id", userDetails.userId)
        formData.append("wallet_address", userDetails.userWallet)

        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/col/user/`,
                data: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
            if (response.status == 200) {
                setFetchedCollections(response.data.data)
                setLoading(false)
            }
        }
        catch (err) {
            console.log(err)
            if (err.response.data.message === "No Collection Found") {
                setFetchedCollections([])
                setLoading(false)
            }
            else setErr(err)
        }
    }
    const handleMint = async (e) => {
        e.preventDefault()
        setApiLoading(true)
        setCollectionErr(undefined)
        setErr(undefined)
        if (nft.img === undefined) {
            setErr('Please select an image for your NFT image.')
            setApiLoading(false)
            return
        }
        else if (nft.name.length == 0) {
            setErr('Please enter your NFT name')
            setApiLoading(false)
            return
        }
        else if (nft.description.length == 0) {
            setErr('Please enter your NFT description.')
            setApiLoading(false)
            return
        }
        else if (nft.collection === -1) {
            setCollectionErr(true)
            setApiLoading(false)
            return
        }
        else if (nft.royalty.length == 0) {
            setErr('Please define your desired royalty percentage.')
            setApiLoading(false)
            return
        }
        else if (nft.royalty < 0 || nft.royalty > 10) {
            setErr('Royalty percentage must be between 0 and 10.')
            setApiLoading(false)
            return
        }
        // else if (nft.supply.length == 0) {
        //     setErr('Please enter your NFT supply.')
        //     setApiLoading(false)
        //     return
        // }
        else if (nft.price.length == 0) {
            setErr('Please enter your NFT price.')
            setApiLoading(false)
            return
        }
        else {
            setErr(undefined)
            setCollectionErr(undefined)
        }
        var ipfsCid = await ipfsUpload()
        var ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
        let code = GenerateRandomCode.TextNumCode(10, 10);
        const key = `${userDetails.nftContract.account.accountId}`;
        let royaltyObj = {
            "market.bitzio.testnet": 2000,
        };
        royaltyObj[key] = nft.royalty * 1000;
        localStorage.setItem("newly created nft id", code)
        try {
            const res = await userDetails.nftContract.nft_mint({
                args: {
                    token_id: `${code}`,
                    metadata: {
                        title: `${nft.name}`,
                        description: `${nft.description}`,
                        media: ipfsUrl,
                        extra: JSON.stringify({
                            collection_id: nft.collection
                        })
                    },
                    receiver_id: userDetails.nftContract.account.accountId,
                    perpetual_royalties: royaltyObj,
                },
                accountId: userDetails.nftContract.account.accountId,
                amount: utils.format.parseNearAmount(`1`)
            });
        } catch (err) {
            console.log(err);
        }
    };
    const fetchNftFromContract = async (nftId) => {
        try {
            const res = await userDetails.nftContract.nft_token({
                token_id: `${nftId}`,
            });
            setFetchedNftFromContract(res)
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <section className='container' style={{ padding: '20px 0px 200px 0px' }}>
            {userDetails.isLoggedIn ?
                loading ? <CircularProgress />
                    :
                    <>
                        <CustomTitle variant="h1" text="Create New Item" margin="10px 0px" fontWeight="bold" />
                        <div style={{ height: '50px' }}>
                            <span style={{ color: '#1593b2', fontSize: 50, verticalAlign: 'top' }}>*</span>
                            <span style={{ verticalAlign: 'sub', color: '#999a9f' }}>Required Fields</span>
                        </div>
                        <InputTitles isRequired={true} variant="h2" title="Image, Video, Auido or 3D Model" isBold={true} explanation="File types supported: JPG,  PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF" />
                        <div style={{ margin: '10px 0px' }}>
                            <span style={{ color: '#1593b2' }}>Note: </span>
                            <span style={{ color: '#999a9f' }}>Maximum file size should be 100MB</span>
                        </div>
                        {/* file input */}
                        <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '30%', padding: '100px', borderRadius: '20px', }}>
                            <label onChange={handleFile} htmlFor="formId">
                                <input type="file" id="formId" hidden />
                                {imageChanged ?
                                    <img id="output" style={{ width: '100%', cursor: 'pointer' }} />
                                    :
                                    <img src={PUBLIC_URL('images/image-icon.png')} style={{ width: '100%', cursor: 'pointer' }} />
                                }
                            </label>
                        </div>

                        {/* fields */}
                        <div className='nft-custom-inputs-wrapper'>
                            <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                            <input onChange={onChange} name="name" type="text" className="form-control" placeholder="Item Name" />

                            <InputTitles title="Description" variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on the item's detail page underneath its image. Markdown syntax is supported" />
                            <textarea name="description" onChange={onChange} type="text" className="form-control" placeholder="Provide a detailed description about your item" />

                            <InputTitles title="Collection" variant="h2" isBold={true} marginTop="40px" explanation="This is the collection where your item will appear" />

                            <select name="collection" onChange={onChange} className="form-select">
                                {fetchedCollections.length !== 0 ?
                                    <>
                                        <option key={-1} value={-1}>Select a collection</option>
                                        {fetchedCollections.map((collection, index) => {
                                            return <option value={collection._id.$oid} key={index}>{collection.title}</option>
                                        })}
                                    </>
                                    :
                                    <>
                                        <option value={-1}>You must create collection first.</option>
                                    </>
                                }
                            </select>

                            <Typography sx={{ margin: '20px 0px', color: '#999a9f' }}>You can create new collections <Link to="/create/collection">Here</Link>.</Typography>

                            <InputTitles title="Royalty" variant="h2" isBold={true} marginTop="40px" explanation="The percentage that NFT creator will earn from each nft trade." />
                            <input name="royalty" onChange={onChange} type="number" className="form-control" placeholder="Enter the royalty percentage" />

                            {/* <InputTitles title="Price" variant="h2" isBold={true} marginTop="40px" explanation="Your NFT price." />
                            <input name="price" onChange={onChange} type="number" className="form-control" placeholder="Enter the price of your NFT" /> */}

                            {/* <InputTitles title="Supply" variant="h2" isBold={true} marginTop="40px" explanation="The number of items that can be minted." />
                            <input onChange={onChange} name="supply" type="text" className="form-control" placeholder="supply" /> */}
                            <hr style={{ margin: '70px 0px' }} />
                            <Box sx={{ width: '10%' }}>
                                {apiLoading ?
                                    <TxtButton text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />} bgColor="#1593b2" width='100px' />
                                    :
                                    <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleMint}>
                                        <TxtButton text="Create" bgColor="#1593b2" />
                                    </div>
                                }

                            </Box>
                            {collectionErr ?
                                <div>
                                    <Typography sx={{ color: 'red' }}>Please choose a collection for your nft.</Typography>
                                    <Typography sx={{ color: 'red' }}>If you didn't create a collection yet, <Link to="/create/collection">Create one.</Link></Typography>
                                </div>
                                : undefined}
                            {err ? <Typography sx={{ color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                            {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                        </div>
                    </>
                :
                <div><LoginAlert /></div>
            }
        </section >
    )
}
