
import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState, useContext } from 'react';
import CustomTitle from '../../../components/CustomTitle';
import InputTitles from '../../../components/InputTitles'
import TxtButton from '../../../components/TxtButton'
import { BG_URL, PUBLIC_URL } from '../../../utils/utils'
import { WalletContext } from '../../../Contexts/WalletContext'
import './CreateCollection.css'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { API_CONFIG, NFT_STORAGE_API_KEY } from '../../../config';
import axios from 'axios'
import LoginAlert from '../../../components/LoginAlert';
import { useSelector } from 'react-redux';
import { TrainRounded } from '@mui/icons-material';
import { COLLECTION_API } from '../../../data/collection_api';


export default function EditCollection() {
    const id = useParams()
    const userDetails = useSelector(state => state.userReducer)
    const [thisCollection, setThisCollection] = useState(undefined)
    const [imageChanged, setImageChanged] = useState(false)
    const [collection, setCollection] = useState({
        logo: undefined,
        banner: undefined,
        title: undefined,
        // categories: [],
        description: undefined,
        links: [
            { website: undefined },
            { discord: undefined },
            { instagram: undefined },
            { telegram: undefined }
        ],
        category: '',
        royalty: undefined,
        // isExplicit: false,
    })
    const [loading, setLoading] = useState(true)
    const apiCall = useRef(undefined)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const theme = useTheme()
    const [fetchedCollections, setFetchedCollections] = useState([])
    const [editing, setEditing] = useState(false)
    const [logo, setLogo] = useState('images/image-icon.png');
    const [logoChanged, setLogoChanged] = useState(false)
    const [bannerChanged, setBannerChanged] = useState(false)
    const [banner, setBanner] = useState(PUBLIC_URL('images/image-icon.png'));
    const [logoErr, setLogoErr] = useState(undefined)
    const [bannerErr, setBannerErr] = useState(undefined)

    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])

    useEffect(() => {
        if (userDetails.isLoggedIn == true)
            // fetchCollections()
            getCollection()
    }, [userDetails])
    const onChange = e => {
        var c = { ...collection };
        if (e.target.files) {
            c[e.target.name] = e.target.files[0];
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
        else {
            c[e.target.name] = e.target.value;
        }
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
            setLogoChanged(true)
        }
        else {
            c[e.target.name] = undefined;
            setCollection(c);
            setLogo('images/image-icon.png')
            setLogoErr("Selected file is not an image")
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
            setBannerChanged(true)
        }
        else {
            c[e.target.name] = undefined;
            setCollection(c);
            setBanner('images/image-icon.png')
            setBannerErr("Selected file is not an image")
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setEditing(true)
        var ipfsUrl;
        // if (imageChanged) {
        //     var ipfsCid = await ipfsUpload()
        //     ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`
        // } else {
        //     ipfsUrl = collection.media
        // }
        if (collection.title === undefined || collection.title.length === 0) {
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
        // if (collection.royalty === undefined || collection.royalty.length === 0) {
        //     setErr("Define royalty percentage")
        //     return
        // }
        // setErr(false)
        // setSuccessMesssage(false)
        const formData = new FormData();
        formData.append('collection_id', id.id);
        formData.append('logo', collection.logo);
        formData.append('banner_image', collection.banner);
        formData.append('title', collection.title)
        formData.append('description', collection.description);
        formData.append('extra', JSON.stringify({}));
        formData.append('creator', userDetails.userWallet);
        formData.append('minted_at', Date.now());
        formData.append('total_mint_cost', 213);
        formData.append('category', collection.category);
        formData.append('nft_mint', JSON.stringify({ mint_per_wallet: 0, limitable: false }))

        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/edit/`,
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
            setSuccessMesssage('Collection edited successfully.')
            setEditing(false)
        }
        catch (err) {
            setEditing(false)
            setLoading(false)
            if (err.status == 400)
                setErr("Bad Request")
            else if (err.status == 403 && err.data.message == "NFT Collection With That Name Already Exists")
                setErr("NFT Collection With That Name Already Exists")
            else setErr("Internal server error")
        }
    }
    // const ipfsUpload = async () => {
    //     try {
    //         const response = await axios({
    //             method: "post",
    //             url: `https://api.collection.storage/upload`,
    //             data: collection.img,
    //             headers: {
    //                 "Authorization": `Bearer ${collection_STORAGE_API_KEY}`,
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             }
    //         });
    //         console.log(response)
    //         if (response.status == 200) {
    //             return response.data.value.cid
    //         }
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }

    const getCollection = async () => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/get/`,
                method: "post",
                body: { collection_id: id.id },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            console.log(response)
            setCollection(response.data)
            setThisCollection(response.data)
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setCollection([])
            }
            else {
                setErr("We're sorry , something is wrong with the server. Please try again later. Will be fixed asap")
            }

        }
    }
    useEffect(() => {
        if (thisCollection) {
            setLoading(false)
        }
    }, [thisCollection])
    return (
        <section className='container' style={{ padding: '20px 0px 200px 0px' }}>
            {!loading ?
                <>
                    {userDetails.isLoggedIn == true && userDetails.userWallet == thisCollection.creator ? <>
                        <>
                            <CustomTitle variant="h1" text="Edit Collection" margin="10px 0px" fontWeight="bold" />
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
                            <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '150px', height: '150px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <label onChange={onLogoChange} htmlFor="logo" style={{ width: "100%", height: "100%" }}>
                                    <input type="file" name="logo" id="logo" hidden />
                                    {loading ? <CircularProgress /> :
                                        <>
                                            {logoChanged ?
                                                <div style={{
                                                    backgroundImage: BG_URL(PUBLIC_URL(logo)),
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '50%',
                                                }} />
                                                :
                                                <div
                                                    style={{
                                                        // width: '100px',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundImage: BG_URL(`${API_CONFIG.COLLECTIONS_API_URL}${thisCollection.logo_path}`),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        borderRadius: '50%',
                                                    }} />
                                            }
                                        </>}
                                </label>
                            </div>
                            {logoErr ?
                                <Typography sx={{ color: 'red', margin: '10px 0px' }}>{logoErr}</Typography>
                                :
                                <Typography sx={{ opacity: 0 }}>err</Typography>
                            }

                            <InputTitles
                                isRequired={true}
                                variant="h2"
                                title="Collection Banner Image"
                                isBold={true}
                                explanation="This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended."
                                margin="10px 0px"
                                marginTop='20px' />
                            <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '500px', height: '200px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <label onChange={onBannerChange} htmlFor="banner" style={{ width: "100%", height: "100%" }}>
                                    <input type="file" name="banner" id="banner" hidden />
                                    {loading ? <CircularProgress /> :
                                        <>
                                            {bannerChanged ?
                                                <div style={{
                                                    backgroundImage: BG_URL(PUBLIC_URL(banner)),
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '20px',
                                                }} />
                                                :
                                                <div
                                                    style={{
                                                        // width: '100px',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundImage: BG_URL(`${API_CONFIG.COLLECTIONS_API_URL}${thisCollection.banner_image_path}`),
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        borderRadius: '20px',
                                                    }} />
                                            }
                                        </>
                                    }
                                </label>
                            </div>
                            {bannerErr ?
                                <Typography sx={{ color: 'red', margin: '10px 0px' }}>{bannerErr}</Typography>
                                :
                                <Typography sx={{ opacity: 0 }}>err</Typography>
                            }
                        </>

                        {/* fields */}
                        <div className='create-collection-inputs-wrapper'>
                            <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                            <input disabled={true} name="name" type="text" className="form-control" placeholder={collection.title} />

                            <InputTitles title="Description" variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on the item's detail page underneath its image." />
                            <textarea name="description" onChange={onChange} type="text" className="form-control" placeholder={collection.description} />

                            <InputTitles title="Category" variant="h2" isBold={true} marginTop="40px" explanation="Select category of your collection." />
                            <input name="category" value={collection.category} onKeyDown={onChange} onChange={onChange} type="text" className="form-control" placeholder={collection.category} />
                            <InputTitles title="Royalty" variant="h2" isBold={true} marginTop="40px" explanation="The percentage that collection creator will earn from each nft trade." />
                            <input name="royalty" onChange={onChange} type="number" className="form-control" placeholder={collection.royalty} />
                            <hr style={{ margin: '40px 0px' }} />
                            <Box sx={{ width: '10%' }}>
                                {loading ?
                                    <TxtButton text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />} bgColor="#1593b2" width='190px' />
                                    :
                                    <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                                        <TxtButton text="Submit" bgColor="#1593b2" />
                                    </div>
                                }
                            </Box>
                            {editing ? <Typography sx={{ color: 'white', margin: '10px 0px' }}>editing...</Typography> : undefined}
                            {err ? <Typography sx={{ color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                            {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                        </div>
                    </> : userDetails.isLoggedIn == true && userDetails.userWallet !== thisCollection.creator ?
                        <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '40vh', flexDirection: 'column' }}>
                            you are not the creator of this collection
                        </Box> :
                        <LoginAlert />
                    }
                </>
                : <CircularProgress />}
        </section >
    )

}
