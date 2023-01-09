
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react';
import './CreateCollection.css'
import { Link } from "react-router-dom"
import CustomTitle from '../../../components/CustomTitle';
import InputTitles from '../../../components/InputTitles';
import TxtButton from '../../../components/TxtButton';
import { BG_URL, PUBLIC_URL } from '../../../utils/utils';
import { API_CONFIG, NFT_STORAGE_API_KEY } from '../../../config';
import { WalletContext } from '../../../Contexts/WalletContext'
import axios from 'axios';
import { useSelector } from 'react-redux';
import LoginAlert from '../../../components/LoginAlert';
import { COLLECTION_API } from '../../../data/collection_api';


// icons
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import Switch from '@mui/material/Switch';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SocialLinkInput from '../../../components/SocialLinks/SocialLinkInput';



export default function CreateCollection() {
    const [value, setValue] = React.useState(Date.now());
    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [checked, setChecked] = React.useState(false);
    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
    };
    const handleCategoryChange = (event) => {
        var c = { ...collection };
        c.category = event.target.value;
        setCollection(c);
    };

    const userDetails = useSelector(state => state.userReducer)
    const apiCall = useRef(undefined)
    const [collection, setCollection] = useState({
        logo: undefined,
        banner: undefined,
        preRevealimage: undefined,
        name: undefined,
        description: undefined,
        category: '',
        royalty: undefined,
        website: '',
        discord: '',
        instagram: '',
        telegram: '',
        nftCount: undefined,
        walletMint: undefined,
        startPrice: undefined,
        mintCount: ''
    })
    const [loading, setLoading] = useState(false)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [logo, setLogo] = useState('images/image-icon.png');
    const [banner, setBanner] = useState(PUBLIC_URL('images/image-icon.png'));
    const [preRevealImage, setPreRevealImage] = useState(PUBLIC_URL('images/image-icon.png'));
    const [preRevealError, setPreRevealError] = useState(undefined);
    const [logoErr, setLogoErr] = useState(undefined)
    const [bannerErr, setBannerErr] = useState(undefined)
    const [royalties, setRoyalties] = useState([])
    const [limitable, setLimitable] = useState(undefined)
    const theme = useTheme()
    const onChange = e => {
        var c = { ...collection };
        c[e.target.name] = e.target.value;
        setCollection(c);
    }
    const onSiteChange = e => {
        var c = { ...collection };
        c[e.target.name] = e.target.value;
        setCollection(c);

    }
    const onLogoChange = (e) => {
        var c = { ...collection };
        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setLogoErr(undefined)
            c[e.target.name] = e.target.files[0];
            const [file] = e.target.files;
            setLogo(URL.createObjectURL(file));
            setCollection(c);
        }
        else {
            c[e.target.name] = undefined;
            setCollection(c);
            setLogo('images/image-icon.png')
            setLogoErr("Selected file is not an image")
        }
    }
    const onPreRevealChange = (e) => {
        var c = { ...collection };
        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setPreRevealError(undefined)
            c[e.target.name] = e.target.files[0];
            const [file] = e.target.files;
            setPreRevealImage(URL.createObjectURL(file));
            setCollection(c);
        }
        else {
            c[e.target.name] = undefined;
            setCollection(c);
            setPreRevealImage('images/image-icon.png')
            setPreRevealError("Selected file is not an image")
        }
    }

    const onBannerChange = (e) => {
        var c = { ...collection };

        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setBannerErr(undefined)
            c[e.target.name] = e.target.files[0];
            const [file] = e.target.files;
            setBanner(URL.createObjectURL(file));
            setCollection(c);
        }
        else {
            c[e.target.name] = undefined;
            setCollection(c);
            setBanner('images/image-icon.png')
            setBannerErr("Selected file is not an image")
        }

    }
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (collection.logo === undefined) {
            setErr("Select a suitable logo for your collection")
            return
        }
        if (collection.banner === undefined) {
            setErr("Select a suitable banner image for collection")
            return
        }
        if (collection.name === undefined || collection.name.length === 0) {
            setErr("Name can't be empty")
            return
        }
        if (collection.description === undefined || collection.description.length === 0) {
            setErr("Description can't be empty")
            return
        }
        if (collection.category === undefined || collection.category.length === 0) {
            setErr("Category can't be empty")
            return
        }
        setErr(false)
        setSuccessMesssage(false)
        setLoading(true)
        const formData = new FormData();
        formData.append('title', collection.name)
        formData.append('description', collection.description);
        var extra = {}
        if (collection.website.length !== 0) {
            extra.website = "https://" + collection.website
        }
        if (collection.discord.length !== 0) {
            extra.discord = "https://discord.gg/" + collection.discord
        }
        if (collection.instagram.length !== 0) {
            extra.instagram = "https://www.instagram.com/" + collection.instagram
        }
        if (collection.telegram.length !== 0) {
            extra.telegram = "https://t.me/" + collection.telegram
        }
        formData.append('extra', JSON.stringify(extra));
        formData.append('category', collection.category);
        formData.append('creator', userDetails.userWallet);
        formData.append('banner_image', collection.banner);
        formData.append('logo', collection.logo);
        formData.append('minted_at', "0");
        // formData.append('reveal_time', "0");
        formData.append('reveal',
            JSON.stringify({
                revealable: checked,
                reveal_time: checked ? value.getTime().toString() : '0',
                reveal_link: checked ? 'https://i.picsum.photos/id/493/200/300.jpg?hmac=grrcfhF-iSyQuaMEkd8b4OH6Gn2W3xm7dUL4-955Vxw' : '',
            }))
        formData.append('total_mint_cost', 0);
        formData.append('mint_per_wallet', JSON.stringify({ mint_count: 0, limitable: false }))
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/create/`,
                method: "post",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setSuccessMesssage('Collection created successfully.')
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            if (err.status == 400)
                setErr("Bad Request")
            else if (err.status == 403 && err.data.message == "NFT Collection With That Name Already Exists")
                setErr("NFT Collection With That Name Already Exists")
            else setErr("Internal server error")
        }
    }


    const handleGenerativeSubmit = async (e) => {
        e.preventDefault()
        if (collection.logo === undefined) {
            setErr("Select a suitable logo for your collection")
            return
        }
        if (collection.banner === undefined) {
            setErr("Select a suitable banner image for collection")
            return
        }
        if (collection.name === undefined || collection.name.length === 0) {
            setErr("Name can't be empty")
            return
        }
        if (collection.description === undefined || collection.description.length === 0) {
            setErr("Description can't be empty")
            return
        }
        if (collection.category === undefined || collection.category.length === 0) {
            setErr("Category can't be empty")
            return
        }
        if (collection.nftCount.length === 0 || collection.nftCount === undefined) {
            setErr("Determine number of nfts for you collection")
            return
        }
        if (collection.startPrice.length === 0 || collection.startPrice === undefined) {
            setErr("Determine the starting price for your mint calendar")
            return
        }
        if (startTime == undefined) {
            setErr("Determine the minting start time")
            return
        }
        if (finishTime == undefined) {
            setErr("Determine the minting expire time")
            return
        }
        const formData = new FormData();
        if (limitable) {
            if (collection.mintCount.length === 0 || parseInt(collection.mintCount) > parseInt(collection.nftCount)) {
                setErr("Please define mint per wallet properly")
                return
            }
            formData.append('mint_per_wallet', JSON.stringify({
                mint_count: collection.mintCount,
                limitable: true
            }))
        } else {
            formData.append('mint_per_wallet', JSON.stringify({ mint_count: 0, limitable: false }))
        }
        let _royalties = [...royalties]
        _royalties.push(
            { wallet_address: "market.bitzio.testnet", royalty: 2 },
        )
        setLoading(true)
        var ipfsCid = await ipfsUpload()
        if (ipfsCid == undefined) {
            setErr("Failed to upload to IPFS storage. Please try again.")
            setLoading(false)
            return
        }
        var ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
        setErr(false)
        setSuccessMesssage(false)
        formData.append('title', collection.name)
        formData.append('description', collection.description);
        var extra = {}
        if (collection.website.length !== 0) {
            extra.website = "https://" + collection.website
        }
        if (collection.discord.length !== 0) {
            extra.discord = "https://discord.gg/" + collection.discord
        }
        if (collection.instagram.length !== 0) {
            extra.instagram = "https://www.instagram.com/" + collection.instagram
        }
        if (collection.telegram.length !== 0) {
            extra.telegram = "https://t.me/" + collection.telegram
        }
        formData.append('extra', JSON.stringify(extra));
        formData.append('category', collection.category);
        formData.append('creator', userDetails.userWallet);
        formData.append('banner_image', collection.banner);
        formData.append('logo', collection.logo);
        formData.append('nft_count', collection.nftCount);
        let sum = 0;
        for (const r of _royalties) {
            r.royalty = parseInt(r.royalty)
            sum += r.royalty;
        }
        formData.append('perpetual_royalties', JSON.stringify(_royalties))

        if (sum > 12) {
            setErr("sum of royalties cannot be more than 10%")
            setLoading(false)
            return
        }
        formData.append('reveal',
            JSON.stringify({
                reveal_time: checked ? value.getTime().toString() : '0',
                reveal_link: checked ? ipfsUrl : '',
                start_mint_price: collection.startPrice,
            }))
        formData.append('nft_mint', JSON.stringify({
            start_mint: startTime.getTime().toString(),
            stop_mint: finishTime.getTime().toString()
        }))
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/gen/create/`,
                method: "post",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setSuccessMesssage('Collection created successfully.')
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            setLoading(false)
            if (err.status == 400)
                setErr("Bad Request")
            else if (err.status == 403 && err.data.message == "Generative NFT Collection With That Name Already Exists")
                setErr("NFT Collection With That Name Already Exists")
            else setErr("Internal server error")
        }
    }


    const ipfsUpload = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `https://api.nft.storage/upload`,
                data: collection.preRevealimage,
                headers: {
                    "Authorization": `Bearer ${NFT_STORAGE_API_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            console.log(response)
            if (response.status == 200) {
                return response.data.value.cid
            }
            else return undefined
        }
        catch (err) {
            console.log(err)
            return undefined
        }
    }
    return (
        <section className='container' style={{ padding: '20px 0px 200px 0px' }}>
            {userDetails.isLoggedIn == true ?
                <>
                    <>
                        <CustomTitle variant="h1" text="Create New Collection" margin="10px 0px" fontWeight="bold" />
                        <div style={{ height: '50px' }}>
                            <span style={{ color: '#1593b2', fontSize: 50, verticalAlign: 'top' }}>*</span>
                            <span style={{ verticalAlign: 'sub', color: '#999a9f' }}>Required Fields</span>
                        </div>
                        {/* file inputs */}
                        {/* logo */}
                        <InputTitles
                            isRequired={true}
                            variant="h2"
                            title="Collection Logo"
                            isBold={true}
                            explanation="This image will also be used for navigation. 350 x 350 recommended." />
                        <div style={{ margin: '10px 0px' }}>
                            <span style={{ color: '#1593b2' }}>Note: </span>
                            <span style={{ color: '#999a9f' }}>File size should be less than 100MB</span>
                        </div>

                        <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '150px', height: '150px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <label onChange={onLogoChange} htmlFor="logo">
                                <input type="file" name="logo" id="logo" hidden />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: BG_URL(PUBLIC_URL(logo)),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0
                                }} />
                            </label>
                        </div>
                        {logoErr ?
                            <Typography sx={{ color: 'red', margin: '10px 0px' }}>{logoErr}</Typography>
                            :
                            <Typography sx={{ opacity: 0 }}>err</Typography>
                        }
                        {/* banner image */}
                        <InputTitles
                            isRequired={true}
                            variant="h2"
                            title="Collection Banner Image"
                            isBold={true}
                            explanation="This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended."
                            margin="10px 0px"
                            marginTop='20px' />
                        <Box sx={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: { xs: '80vw', md: '70vw', lg: '500px' }, height: '200px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <label onChange={onBannerChange} htmlFor="banner">
                                <input type="file" name="banner" id="banner" hidden />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: BG_URL(PUBLIC_URL(banner)),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    borderRadius: '20px'
                                }} />
                            </label>
                        </Box>
                        {bannerErr ?
                            <Typography sx={{ color: 'red', margin: '10px 0px' }}>{bannerErr}</Typography>
                            :
                            <Typography sx={{ opacity: 0 }}>err</Typography>
                        }
                    </>

                    {/* fields */}
                    <div className='create-collection-inputs-wrapper'>
                        <form autoComplete='off'>
                            <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                            <input onChange={onChange} name="name" type="text" className="form-control" placeholder="Item Name" />

                            <InputTitles isRequired={true} title="Description" variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on the item's detail page underneath its image." />
                            <textarea name="description" onChange={onChange} type="text" className="form-control" placeholder="Provide a detailed description about your item" />

                            <InputTitles isRequired={true} title="Category" variant="h2" isBold={true} marginTop="40px" explanation="Select category of your collection." />
                            {/* <input name="category" value={collection.category} onKeyDown={onChange} onChange={onChange} type="text" className="form-control" placeholder="Category" /> */}
                            <Box className="create-col-select-wrapper" sx={{ width: '30%', marginTop: '30px' }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'white' }} id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={collection.category}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    // border: "1px solid black",
                                                    // borderRadius: "5%",
                                                    backgroundColor: '#3a3d4d',
                                                    color: 'white',
                                                    margin: '2px 0px'
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value={'Art'}>Art</MenuItem>
                                        <MenuItem value={'Collectibles'}>Collectibles</MenuItem>
                                        <MenuItem value={'Photography'}>Photography</MenuItem>
                                        <MenuItem value={'Sports'}>Sports</MenuItem>
                                        <MenuItem value={'Utility'}>Utility</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* generative */}


                            <Box>
                                <Typography sx={{ fontWeight: 'bold', marginTop: "40px", display: 'inline-block' }} variant="h2">Revealable</Typography>
                                <Switch checked={checked} onChange={handleCheckChange} inputProps={{ 'aria-label': 'controlled' }} />
                            </Box>
                            <Typography sx={{ color: '#999a9f', margin: '10px 0px' }}> Flip the switch if you want to reveal your NFT later.</Typography>
                            <Box sx={{ display: checked ? "block" : "none", height: checked ? "auto" : '0px', transition: '0.5s', opacity: checked ? 1 : 0 }}>
                                <div className='create-col-reveal-wrapper'>
                                    <div>
                                        <Box sx={{ color: 'white', marginTop: '20px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="start minting time" value={startTime} onChange={(value, event) => { setStartTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box sx={{ color: 'white', marginTop: '20px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="stop minting time" value={finishTime} onChange={(value, event) => { setFinishTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box sx={{ color: 'white', marginTop: '50px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="Reveal Date" value={value} onChange={handleChange} renderInput={(params) => <TextField {...params} />} />
                                            </LocalizationProvider>
                                        </Box>
                                        <InputTitles variant="h4" title="mint start price" isBold={true} marginTop="20px" isRequired={true} />
                                        <input style={{ width: "208px" }} onChange={onChange} name="startPrice" type="number" className="form-control" placeholder="starting price" onWheel={(e) => e.target.blur()} />
                                        <InputTitles variant="h4" title="nft count" isBold={true} marginTop="20px" isRequired={true} />
                                        <input style={{ width: "208px" }} onChange={onChange} name="nftCount" type="number" className="form-control" placeholder="nft count" onWheel={(e) => e.target.blur()} />
                                    </div>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', marginTop: "40px", display: 'inline-block' }} variant="h2">Limitable</Typography>
                                        <Switch checked={limitable} onChange={(event) => { setLimitable(event.target.checked) }} inputProps={{ 'aria-label': 'controlled' }} />
                                        <Typography sx={{ color: '#999a9f', margin: '10px 0px' }}> Flip the switch if you want to limit users mint per wallet.</Typography>
                                        <Box sx={{ display: limitable ? "block" : "none" }}>
                                            <InputTitles variant="h4" title="Mint per wallet" isBold={true} marginTop="20px" isRequired={true} />
                                            <input style={{ width: "208px" }} onChange={onChange} name="mintCount" type="number" className="form-control" placeholder="Mint per wallet" onWheel={(e) => e.target.blur()} />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <InputTitles isRequired={true} variant="h2" title="NFTs Pre-reveal Image" isBold={true} explanation="This image will be shown as NFT image for all NFTs before reveal time. 350 x 350 recommended." marginTop="30px" />
                                        <div style={{ margin: '10px 0px' }}>
                                            <span style={{ color: '#1593b2' }}>Note: </span>
                                            <span style={{ color: '#999a9f' }}>File size should be less than 100MB</span>
                                        </div>

                                        <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '150px', height: '150px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                            <label onChange={onPreRevealChange} htmlFor="preReveal">
                                                <input type="file" name="preRevealimage" id="preReveal" hidden />
                                                <div style={{ width: '100%', height: '100%', backgroundImage: BG_URL(PUBLIC_URL(preRevealImage)), backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '50%', cursor: 'pointer', position: 'absolute', top: 0, right: 0 }} />
                                            </label>
                                        </div>
                                        {preRevealError ?
                                            <Typography sx={{ color: 'red', margin: '10px 0px' }}>{preRevealError}</Typography>
                                            :
                                            <Typography sx={{ opacity: 0 }}>err</Typography>
                                        }
                                    </Box>
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
                                </div>
                            </Box>



                            <InputTitles title="Links" variant="h2" isBold={true} marginTop="40px" explanation="Bitzio will include the given links on this collection's detail page, so that users can check them out." />

                            <SocialLinkInput
                                logo={
                                    <LanguageIcon sx={{ fontSize: '30px' }} />
                                }
                                placeHolder="https://"
                                state={collection.website}
                                onChange={onSiteChange}
                                name="website"
                                type='url'
                            />
                            <SocialLinkInput
                                logo={
                                    <img src={PUBLIC_URL('images/social/discord-grey.png')} style={{ width: '23px', marginLeft: '4px', marginRight: '2px' }} />
                                }
                                placeHolder="https://discord.gg/"
                                state={collection.discord}
                                onChange={onSiteChange}
                                name="discord"
                                type='url'
                            />
                            <SocialLinkInput
                                logo={
                                    <InstagramIcon sx={{ fontSize: '30px' }} />
                                }
                                placeHolder="https://www.instagram.com/"
                                state={collection.instagram}
                                onChange={onSiteChange}
                                name="instagram"
                                type='url'
                            />
                            <SocialLinkInput
                                logo={
                                    <TelegramIcon sx={{ fontSize: '30px' }} />
                                }
                                placeHolder="https://t.me/"
                                state={collection.telegram}
                                onChange={onSiteChange}
                                name="telegram"
                                type='url'
                            />

                            <hr style={{ margin: '40px 0px' }} />
                            <Box sx={{ width: '10%' }}>
                                {loading ?
                                    <TxtButton
                                        text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                        bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                        borderColor="rgba(27, 127, 153, 1)"
                                        width='190px' />
                                    :
                                    <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={checked ? handleGenerativeSubmit : handleSubmit}>
                                        <TxtButton
                                            text="Create Collection"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)" />
                                    </div>
                                }
                            </Box>
                            {err ? <Typography sx={{ color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                            {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                        </form>
                    </div>
                </>
                : <LoginAlert />
            }
        </section >
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
                <input placeholder="Wallet address.testnet" className="form-control" value={royalty.wallet_address} onChange={e => {
                    let r = { ...royalty };
                    r.wallet_address = e.target.value;
                    r.wallet_address = r.wallet_address.trim()
                    setRoyalty(r);
                }} />
            </Box>
            <Box sx={{ flex: 5, margin: '0px 2px' }}>
                <input placeholder="percentage" className="form-control" value={royalty.value} onChange={e => {
                    let r = { ...royalty };
                    r.royalty = e.target.value;
                    setRoyalty(r);
                }} />
            </Box>
        </Box>
    )
}
