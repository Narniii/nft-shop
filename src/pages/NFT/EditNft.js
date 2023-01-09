
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState, useContext } from 'react';
import CustomTitle from '../../components/CustomTitle'
import InputTitles from '../../components/InputTitles'
import TxtButton from '../../components/TxtButton'
import { PUBLIC_URL } from '../../utils/utils'
import './NFT.css'
import { WalletContext } from '../../Contexts/WalletContext'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { API_CONFIG, NFT_STORAGE_API_KEY } from '../../config';
import axios from 'axios'
import LoginAlert from '../../components/LoginAlert';
import { useSelector } from 'react-redux';

export default function EditNft() {
    const controller = new AbortController();
    const id = useParams()
    const userDetails = useSelector(state => state.userReducer)
    // const walletAddress = wallet.getAccountId()
    const [thisNFT, setThisNFT] = useState(undefined)
    const [thisCollection, setThisCollection] = useState(undefined)
    const [imageChanged, setImageChanged] = useState(false)
    const [nft, setNft] = useState({
        img: undefined,
        name: undefined,
        website: undefined,
        description: undefined,
        collection: undefined,
        supply: undefined,
        royalty: undefined,
        price: undefined
    })
    const [loading, setLoading] = useState(true)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const theme = useTheme()
    const [fetchedCollections, setFetchedCollections] = useState([])
    const [editing, setEditing] = useState(false)
    const [collectionErr, setCollectionErr] = useState(false)
    useEffect(() => {
        if (userDetails.isLoggedIn == true)
            // fetchCollections()
            getNFT()
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
    const handleSubmit = async (e) => {
        e.preventDefault()
        setEditing(true)
        if (nft.img === undefined) {
            setErr('Please select an image for your NFT image.')
            return
        }
        else if (nft.name.length == 0) {
            setErr('Please enter your NFT name')
            return
        }
        else if (nft.description.length == 0) {
            setErr('Please enter your NFT description.')
            return
        }
        else if (nft.collection === -1) {
            setCollectionErr(true)
            return
        }
        else if (nft.supply.length == 0) {
            setErr('Please enter your NFT supply.')
            return
        }
        else if (nft.price.length == 0) {
            setErr('Please enter your NFT price.')
            return
        }
        else {
            setErr(undefined)
            setCollectionErr(undefined)
        }
        var ipfsUrl;
        if (imageChanged) {
            var ipfsCid = await ipfsUpload()
            ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
        } else {
            ipfsUrl = nft.media
        }
        // console.log(nft.collection)
        try {
            console.log(nft._id.$oid)
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/nft/edit/`,
                data: {
                    // collection_id: nft.collection,
                    nft_id: nft._id.$oid,
                    title: nft.title,
                    description: nft.description,
                    extra: JSON.stringify({ website: nft.website }),
                    issued_at: `${Date.now()}`,
                    reference: JSON.stringify({}),
                    expires_at: `${Date.now()}`,
                    price: nft.price,
                    approved_account_ids: JSON.stringify({}),
                    current_owner: userDetails.user_id,
                    owners: [{
                        owner_wallet_address: userDetails.userWallet,
                        royalty: nft.royalty
                    }],
                    media: ipfsUrl,
                    perpetual_royalties: [{
                        wallet_address: userDetails.userWallet,
                        royalty: nft.royalty
                    }]
                }
            });
            console.log(response)
            if (response.status == 200) {
                setEditing(false)
                setSuccessMesssage("NFT successfully edited")
                console.log(response)
            }
        }
        catch (err) {
            console.log(err)
            setEditing(false)
            setErr(err.message)
            setLoading(false)
        }
        // handleMint(nft.name, nft.description, "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif")
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
            console.log(response)
            if (response.status == 200) {
                return response.data.value.cid
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const getNFT = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/nft/get/`,
                data: { nft_id: id.id },
            });
            console.log(response)
            if (response.status == 200) {
                setNft(response.data.data[1])
                setThisNFT(response.data.data[1])
                setThisCollection(response.data.data[0])
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if (thisNFT && thisCollection) {
            setLoading(false)
        }
    }, [thisNFT, thisCollection])
    return (
        <section className='container' style={{ padding: '20px 0px 200px 0px' }}>
            {!loading ?
                <>
                    {userDetails.isLoggedIn == true && userDetails.userWallet == thisCollection.collection_creator ?
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
                            <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '30%', padding: '30px', borderRadius: '20px', }}>
                                <label onChange={handleFile} htmlFor="formId">
                                    <input type="file" id="formId" hidden />
                                    {imageChanged ?
                                        <img id="output" style={{ width: '100%', cursor: 'pointer' }} />
                                        :
                                        <img src={thisNFT.media} style={{ width: '100%', height: "100%", cursor: 'pointer' }} />
                                    }
                                </label>
                            </div>

                            {/* fields */}
                            <div className='nft-custom-inputs-wrapper'>
                                <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                                <input onChange={onChange} name="name" type="text" className="form-control" placeholder={nft.title} />

                                <InputTitles title="Your website" variant="h2" isBold={true} marginTop="40px" explanation="aqua will include a link to this URL on this item's detail page, so that users can click to learn more about it." />
                                <input onChange={onChange} name="website" type="text" className="form-control" placeholder={nft.website} />

                                <InputTitles title="Description" variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on the item's detail page underneath its image. Markdown syntax is supported" />
                                <textarea name="description" onChange={onChange} type="text" className="form-control" placeholder={nft.description} />

                                <InputTitles title="Collection" variant="h2" isBold={true} marginTop="40px" explanation="This is the collection where your item will appear" />
                                <textarea name="collection" type="text" disabled={true} className="form-control" placeholder={thisCollection.collection_title} />

                                <InputTitles title="Royalty" variant="h2" isBold={true} marginTop="40px" explanation="The percentage that NFT creator will earn from each nft trade." />
                                <input name="royalty" onChange={onChange} type="number" className="form-control" placeholder={nft.royalty} />

                                <InputTitles title="Price" variant="h2" isBold={true} marginTop="40px" explanation="Your NFT price." />
                                <input name="price" onChange={onChange} type="number" className="form-control" placeholder={nft.price} />

                                <InputTitles title="Supply" variant="h2" isBold={true} marginTop="40px" explanation="The number of items that can be minted." />
                                <input onChange={onChange} name="supply" type="text" className="form-control" placeholder={nft.supply} />
                                <hr style={{ margin: '70px 0px' }} />
                                <Box sx={{ width: '10%' }}>
                                    <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                                        <TxtButton text="Submit" bgColor="#1593b2" />
                                    </div>
                                </Box>
                                {editing ? <Typography sx={{ color: 'white', margin: '10px 0px' }}>editing...</Typography> : undefined}
                                {err ? <Typography sx={{ color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                                {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                            </div>
                        </> : userDetails.isLoggedIn == true && userDetails.userWallet !== thisCollection.collection_creator ?
                            <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '40vh', flexDirection: 'column' }}>
                                you are not the creator of this collection
                            </Box> :
                            <LoginAlert />
                    }
                </>
                :
                <CircularProgress />
            }
        </section>
    )
}
