
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState, useContext } from 'react';
import CustomTitle from '../../components/CustomTitle'
import InputTitles from '../../components/InputTitles'
import TxtButton from '../../components/TxtButton'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import './NFT.css'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { API_CONFIG, NFT_STORAGE_API_KEY } from '../../config';
import axios from 'axios'
import LoginAlert from '../../components/LoginAlert';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { getConfig } from '../../config';

export default function CreateNFT() {
    const controller = new AbortController();

    const userDetails = useSelector(state => state.userReducer)
    const [nft, setNft] = useState({
        img: undefined,
        name: '',
        description: '',
        collection: -1,
        supply: '',
        royalty: '',
        price: ''
    })
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(false)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [collectionErr, setCollectionErr] = useState(undefined)
    const theme = useTheme()
    const [fetchedCollections, setFetchedCollections] = useState([])
    const [logo, setLogo] = useState('images/image-icon.png');
    const [logoErr, setLogoErr] = useState(undefined)
    const apiCall = useRef(undefined)
    const [properties, setProperties] = useState([])
    const [royalties, setRoyalties] = useState([])
    const onLogoChange = (e) => {
        var n = { ...nft };
        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setLogoErr(undefined)
            n.img = e.target.files[0];
            const [file] = e.target.files;
            setLogo(URL.createObjectURL(file));
            setNft(n);
        }
        else {
            n[e.target.name] = undefined;
            setNft(n);
            setLogo('images/image-icon.png')
            setLogoErr("Selected file is not an image")
        }
    }
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])
    useEffect(() => {
        if (userDetails.isLoggedIn)
            fetchCollections()
    }, [userDetails])

    const onChange = e => {
        var n = { ...nft };
        n[e.target.name] = e.target.value;
        setNft(n);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiLoading(true)
        setCollectionErr(undefined)
        setSuccessMesssage(undefined)
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
        let _royalties = [...royalties]
        _royalties.push(
            { wallet_address: "market.bitzio.testnet", royalty: 2 },
        )
        let sum = 0;
        for (const r of _royalties) {
            r.royalty = parseInt(r.royalty)
            sum += r.royalty;
        }
        if (sum > 12) {
            setErr("sum of royalties cannot be more than 10%")
            setApiLoading(false)
            return
        }

        var ipfsCid = await ipfsUpload()
        var ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
        var ipfsFileCid = undefined
        var ipfsFileUrl = undefined
        if (properties.length != 0) {
            ipfsFileCid = await ipfsFileUpload()
            ipfsFileUrl = `https://${ipfsFileCid}.ipfs.dweb.link/`
        }
        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/nft/create/`,
                data: {
                    collection_id: nft.collection,
                    title: nft.name,
                    description: nft.description,
                    extra: properties,
                    reference: ipfsFileCid ? JSON.stringify({ attributes: ipfsFileUrl }) : JSON.stringify({}),
                    price: nft.price.toString(),
                    current_owner: '',
                    media: ipfsUrl,
                    expires_at: '0',
                    perpetual_royalties: _royalties
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
            setLoading(false)
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
            console.log(response)
            if (response.status == 200) {
                return response.data.value.cid
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const ipfsFileUpload = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `https://api.nft.storage/upload`,
                data: properties,
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
                signal: controller.signal
            });
            console.log(response)
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

    return (
        <section className='container' style={{ padding: '20px 10px 200px 10px' }}>
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
                        <Box sx={{
                            border: `2px dashed ${theme.pallete.lightBorder}`,
                            width: '340px',
                            height: '300px',
                            borderRadius: '20px',
                            position: 'relative',
                            margin: { xs: '0 auto', sm: 0 }
                        }}>
                            <label onChange={onLogoChange} htmlFor="logo">
                                <input type="file" name="logo" id="logo" hidden />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: BG_URL(PUBLIC_URL(logo)),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0
                                }} />
                            </label>
                        </Box>
                        {logoErr ?
                            <Typography sx={{ color: 'red', margin: '10px 0px', textAlign: { xs: 'center', sm: 'left' } }}>{logoErr}</Typography>
                            :
                            <Typography sx={{ opacity: 0 }}>err</Typography>
                        }

                        {/* fields */}
                        <div className='nft-custom-inputs-wrapper'>
                            <InputTitles variant="h2" title="Name" isBold={true} marginTop="20px" isRequired={true} />
                            <input onChange={onChange} name="name" type="text" className="form-control" placeholder="Item Name" />

                            <InputTitles title="Description" isRequired={true} variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on the item's detail page underneath its image. Markdown syntax is supported" />
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

                            <InputTitles title="Price" variant="h2" isBold={true} marginTop="40px" explanation="Your NFT price." />
                            <input name="price" onWheel={(e) => e.target.blur()} onChange={onChange} type="number" className="form-control" placeholder="Enter the price of your NFT" />

                            {/* <InputTitles title="Supply" variant="h2" isBold={true} marginTop="40px" explanation="The number of items that can be minted." />
                            <input onChange={onChange} name="supply" type="text" className="form-control" placeholder="supply" />
                             */}

                            <InputTitles title="Properties" variant="h2" isBold={true} marginTop="40px" explanation="Textual traits that show up as rectangles." />
                            {properties.map((property, index) => {
                                const setProperty = (p) => {
                                    let pr = [...properties];
                                    pr[index] = { ...p };
                                    setProperties(pr);
                                };
                                const removeProperty = (p) => {
                                    let pr = [...properties];
                                    let indx = pr.indexOf(pr[index])
                                    pr.splice(indx, 1)
                                    setProperties(pr)
                                }
                                return <PropertyView key={index} property={property} setProperty={setProperty} removeProperty={removeProperty} />
                            })}
                            <TxtButton
                                text="Add property"
                                bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                borderColor="rgba(27, 127, 153, 1)"
                                margin="20px 0px"
                                onClick={() => {
                                    let p = [...properties];
                                    let pr = {
                                        name: '',
                                        value: '',
                                    };;
                                    p.push(pr);
                                    setProperties(p);
                                }}
                            />
                            <InputTitles title="Royalty" variant="h2" isBold={true} marginTop="40px" explanation="You can specify wallet addresses to receive a percentage of sale prices each time item is transfered." />
                            {royalties.map((royalty, index) => {
                                const setRoyalty = (r) => {
                                    let rt = [...royalties];
                                    rt[index] = { ...r };
                                    setRoyalties(rt);
                                };
                                const removeRoyalty = (r) => {
                                    let rt = [...royalties];
                                    let indx = rt.indexOf(rt[index])
                                    rt.splice(indx, 1)
                                    setRoyalties(rt)
                                }
                                return <RoyaltyView key={index} royalty={royalty} setRoyalty={setRoyalty} removeRoyalty={removeRoyalty} />
                            })}
                            <TxtButton
                                text="Add wallet address"
                                bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                borderColor="rgba(27, 127, 153, 1)"
                                margin="20px 0px"
                                onClick={() => {
                                    let r = [...royalties];
                                    let rt = {
                                        wallet_address: '',
                                        royalty: '',
                                    };;
                                    r.push(rt);
                                    setRoyalties(r);
                                }}
                            />
                            <hr style={{ margin: '70px 0px' }} />
                            <Box sx={{ width: '10%' }}>
                                {apiLoading ?
                                    <TxtButton
                                        text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                        borderColor="rgba(27, 127, 153, 1)"
                                        width='100px' />
                                    :
                                    <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                                        <TxtButton
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            text="Create NFT"
                                        />
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
                            {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px', fontSize: '18px' }}>{successMesssage}</Typography> : undefined}
                        </div>
                    </>
                :
                <div><LoginAlert /></div>
            }
        </section >
    )
}
function PropertyView({ property, setProperty, removeProperty }) {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: { xs: '100%', sm: '90%', md: '80%', lg: '50%' } }}>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }} onClick={e => removeProperty({ ...property })}>
                <DeleteIcon style={{ color: theme.pallete.darkText, fontSize: '24px', cursor: 'pointer' }} />
            </Box>
            <Box sx={{ flex: 5, margin: '0px 2px' }}>
                <input onWheel={(e) => e.target.blur()} placeholder="Property" className="form-control" value={property.name} onChange={e => {
                    let p = { ...property };
                    p.name = e.target.value;
                    setProperty(p);
                }} />
            </Box>
            <Box sx={{ flex: 5, margin: '0px 2px' }}>
                <input onWheel={(e) => e.target.blur()} placeholder="Value" className="form-control" value={property.value} onChange={e => {
                    let p = { ...property };
                    p.value = e.target.value;
                    setProperty(p);
                }} />
            </Box>
        </Box>
    )
}

function RoyaltyView({ royalty, setRoyalty, removeRoyalty }) {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', width: { xs: '100%', sm: '90%', md: '80%', lg: '50%' } }}>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }} onClick={e => removeRoyalty({ ...royalty })}>
                <DeleteIcon style={{ color: theme.pallete.darkText, fontSize: '24px', cursor: 'pointer' }} />
            </Box>
            <Box sx={{ flex: 5, margin: '0px 2px' }}>
                <input onWheel={(e) => e.target.blur()} placeholder="Wallet address.testnet" className="form-control" value={royalty.wallet_address} onChange={e => {
                    let r = { ...royalty };
                    r.wallet_address = e.target.value;
                    r.wallet_address = r.wallet_address.trim()
                    setRoyalty(r);
                }} />
            </Box>
            <Box sx={{ flex: 5, margin: '0px 2px' }}>
                <input onWheel={(e) => e.target.blur()} placeholder="percentage" className="form-control" value={royalty.value} onChange={e => {
                    let r = { ...royalty };
                    r.royalty = e.target.value;
                    setRoyalty(r);
                }} />
            </Box>
        </Box>
    )
}
