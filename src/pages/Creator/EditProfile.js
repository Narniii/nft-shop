import React from 'react'
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InputTitles from "../../components/InputTitles";
import LoginAlert from "../../components/LoginAlert";
import TxtButton from "../../components/TxtButton";
import { API_CONFIG } from "../../config";
import { AUTH_API } from "../../data/auth_api";
import { BG_URL, PUBLIC_URL } from "../../utils/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import SocialLinkInput from '../../components/SocialLinks/SocialLinkInput';

export default function EditProfile() {
    const theme = useTheme()
    const userDetails = useSelector(state => state.userReducer)
    const [isBioChanged, setIsBioChanged] = useState(false)
    const [isAvatarChanged, setIsAvatarChanged] = useState(undefined)
    const [isBannerChanged, setIsBannerChanged] = useState(undefined)
    const [bioSuccess, setBioSuccess] = useState(undefined)
    const [bannerSuccess, setBannerSuccess] = useState(undefined)
    const [avatarSuccess, setAvatarSuccess] = useState(undefined)
    const [user, setUser] = useState({
        bio: "",
        banner: undefined,
        avatar: undefined,
        discord: '',
        telegram: '',
        instagram: '',
        website: ''
    })
    const [loading, setLoading] = useState(true)
    const [apiLoading, setApiLoading] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [successMessage, setSuccessMesssage] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState(undefined)
    const apiCall = useRef(undefined)
    const bioApiCall = useRef(undefined)
    const avatarApiCall = useRef(undefined)
    const bannerApiCall = useRef(undefined)
    const [logo, setLogo] = useState('images/image-icon.png');
    const [banner, setBanner] = useState(PUBLIC_URL('images/image-icon.png'));
    const [logoErr, setLogoErr] = useState(undefined)
    const [bannerErr, setBannerErr] = useState(undefined)
    const [isAnyApiCalled, setIsAnyApiCalled] = useState(undefined)
    useEffect(() => {
        if (userDetails.isLoggedIn) {
            getUser()
        }
    }, [userDetails])
    const onSiteChange = e => {
        setIsBioChanged(true)
        var u = { ...user };
        u[e.target.name] = e.target.value;
        setUser(u);

    }
    const getUser = async () => {
        try {
            apiCall.current = AUTH_API.request({
                path: `/auth/user/get/`,
                method: "post",
                body: { "wallet_address": userDetails.userWallet, "id": userDetails.userId },

            });
            let response = await apiCall.current.promise;
            let _user = response.data
            let tmp = {
                bio: undefined,
                banner: undefined,
                avatar_path: undefined,
                discord: '',
                telegram: '',
                instagram: '',
                website: ''
            }
            if (!response.isSuccess)
                throw response
            if (_user.avatar_path) tmp.avatar = _user.avatar_path
            if (_user.banner_path) tmp.banner = _user.banner_path
            if (_user.description) tmp.bio = _user.description
            if (_user.extra.discord) tmp.discord = _user.extra.discord
            if (_user.extra.telegram) tmp.telegram = _user.extra.telegram
            if (_user.extra.instagram) tmp.instagram = _user.extra.instagram
            if (_user.extra.website) tmp.website = _user.extra.website
            setUser(tmp)
            setLoading(false)

        }
        catch (err) {
            setErr(err.toString())
            console.log(err)
        }
    }
    const onAvatarChange = (e) => {
        var c = { ...user };
        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setLogoErr(undefined)
            c.avatar = e.target.files[0];
            const [file] = e.target.files;
            setLogo(URL.createObjectURL(file));
            setUser(c);
            setIsAvatarChanged(true)
        }
        else {
            c.avatar = undefined;
            setUser(c);
            setLogo('images/image-icon.png')
            setLogoErr("Selected file is not an image")
            setIsAvatarChanged(false)
        }
    }
    const onBannerChange = (e) => {
        var c = { ...user };

        if (e.target.files && e.target.files[0] && e.target.files[0].type.indexOf("image") !== -1) {
            setBannerErr(undefined)
            c.banner = e.target.files[0];
            const [file] = e.target.files;
            setBanner(URL.createObjectURL(file));
            setUser(c);
            setIsBannerChanged(true)
        }
        else {
            c.banner = undefined;
            setUser(c);
            setBanner('images/image-icon.png')
            setBannerErr("Selected file is not an image")
            setIsBannerChanged(false)
        }
    }
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            if (bioApiCall.current !== undefined)
                bioApiCall.current.cancel();
            if (avatarApiCall.current !== undefined)
                avatarApiCall.current.cancel();
            if (bannerApiCall.current !== undefined)
                bannerApiCall.current.cancel();
        }
    }, [])
    const handleSubmit = async () => {
        if (!isAvatarChanged && !isBannerChanged && !isBioChanged) {
            setErrorMessage('Nothing is changed to submit')
            return
        }
        setIsAnyApiCalled(true)
        setErrorMessage(undefined)
        setSuccessMesssage(undefined)
        setApiLoading(true)
        if (isAvatarChanged && !avatarSuccess) handleAvatarChangeApi()
        if (isBannerChanged && !bannerSuccess) handleBannerChangeApi()
        if (isBioChanged && !bioSuccess) handleBioChangeApi()
    }
    const handleAvatarChangeApi = async () => {
        try {
            const formData = new FormData()
            formData.append('id', userDetails.userId)
            formData.append('avatar', user.avatar)
            avatarApiCall.current = AUTH_API.request({
                path: "/auth/user/edit/avatar/",
                body: formData,
                method: 'post'
            })
            const response = await avatarApiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            setAvatarSuccess(true)
        }
        catch (err) {
            setErrorMessage("Failed to set avatar. Please try again.")
            setAvatarSuccess(false)
        }

    }
    const handleBannerChangeApi = async () => {
        try {
            const formData = new FormData()
            formData.append('id', userDetails.userId)
            formData.append('banner', user.banner)
            bannerApiCall.current = AUTH_API.request({
                path: "/auth/user/edit/banner/",
                body: formData,
                method: 'post'
            })
            const response = await bannerApiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            setBannerSuccess(true)
        }
        catch (err) {
            setBannerSuccess(false)
            setErrorMessage("Failed to set banner image. Please try again")
        }
    }
    const handleBioChangeApi = async () => {
        console.log(user)
        var extra = {}
        if (user.website.length !== 0) {
            extra.website = "https://" + user.website
        }
        if (user.discord.length !== 0) {
            extra.discord = "https://discord.gg/" + user.discord
        }
        if (user.instagram.length !== 0) {
            extra.instagram = "https://www.instagram.com/" + user.instagram
        }
        if (user.telegram.length !== 0) {
            extra.telegram = "https://t.me/" + user.telegram
        }
        try {
            const formData = new FormData()
            formData.append('id', userDetails.userId)
            formData.append('description', user.bio)
            formData.append('extra', JSON.stringify(extra));
            bioApiCall.current = AUTH_API.request({
                path: "/auth/user/edit/",
                body: formData,
                method: 'post'
            })
            const response = await bioApiCall.current.promise
            console.log(response)
            if (!response.isSuccess)
                throw response
            setBioSuccess(true)
        }
        catch (err) {
            setBioSuccess(false)
            setErrorMessage("Failed to set bio. Please try again")
        }
    }
    useEffect(() => {
        if (errorMessage) {
            setApiLoading(false)
        }
        if (!isAnyApiCalled) return
        else {
            let totalSuccess = false
            let _bioSuccess = false
            let _bannerSuccess = false
            let _avatarSuccess = false
            if (isAvatarChanged) _avatarSuccess = avatarSuccess
            else _avatarSuccess = true
            if (isBannerChanged) _bannerSuccess = bannerSuccess
            else _bannerSuccess = true
            if (isBioChanged) _bioSuccess = bioSuccess
            else _bioSuccess = true
            if (_bioSuccess && _avatarSuccess && _bannerSuccess) totalSuccess = true
            if (totalSuccess) {
                setSuccessMesssage("Profile edited successfully")
                setErrorMessage(undefined)
                setApiLoading(false)
            }
        }
    }, [bioSuccess, bannerSuccess, avatarSuccess, errorMessage])
    return (
        <Box className="container">
            {loading ?
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                    <Typography>Loading...</Typography>
                </Box>
                :
                <Box sx={{ margin: '5% 0px' }}>
                    <InputTitles
                        isRequired={false}
                        variant="h2"
                        title="Avatar"
                        isBold={true}
                    />
                    <div style={{ margin: '10px 0px' }}>
                        <span style={{ color: '#1593b2' }}>Note: </span>
                        <span style={{ color: '#999a9f' }}>File size should be less than 100MB</span>
                    </div>

                    <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '150px', height: '150px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <label onChange={onAvatarChange} htmlFor="logo">
                            <input type="file" name="logo" id="logo" hidden />
                            {isAvatarChanged ?
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
                                :
                                user.avatar ?
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.avatar}`),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0
                                    }} />
                                    :
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
                            }
                        </label>
                    </div>
                    {logoErr ?
                        <Typography sx={{ color: 'red', margin: '10px 0px' }}>{logoErr}</Typography>
                        :
                        <Typography sx={{ opacity: 0 }}>err</Typography>
                    }
                    <InputTitles
                        isRequired={false}
                        variant="h2"
                        title="Profile Banner Image"
                        isBold={true}
                        margin="10px 0px"
                        marginTop='20px' />
                    <Box sx={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: { xs: '80vw', md: '50vw', lg: '500px' }, height: '200px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <label onChange={onBannerChange} htmlFor="banner">
                            <input type="file" name="banner" id="banner" hidden />
                            {isBannerChanged ?
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
                                :
                                user.banner ?
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: BG_URL(PUBLIC_URL(`${API_CONFIG.AUTH_API_URL}${user.banner}`)),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        borderRadius: '20px'
                                    }} />
                                    :
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
                            }

                        </label>
                    </Box>
                    {bannerErr ?
                        <Typography sx={{ color: 'red', margin: '10px 0px' }}>{bannerErr}</Typography>
                        :
                        <Typography sx={{ opacity: 0 }}>err</Typography>
                    }
                    <div className='create-collection-inputs-wrapper'>
                        <InputTitles isRequired={true} title="Bio" variant="h2" isBold={true} marginTop="40px" explanation="The description will be included on profile detail page underneath your avatar image." />
                        <textarea style={{ margin: '20px 0px' }} name="description" value={user.bio} onChange={(e) => {
                            if (!isBioChanged) setIsBioChanged(true)
                            let u = { ...user }
                            u.bio = e.target.value
                            setUser(u)
                        }} type="text" className="form-control" placeholder="Provide a detailed description about your item" />
                    </div>
                    <SocialLinkInput
                        logo={
                            <LanguageIcon sx={{ fontSize: '30px' }} />
                        }
                        placeHolder="https://"
                        state={user.website}
                        onChange={onSiteChange}
                        name="website"
                        type='url'
                    />
                    <SocialLinkInput
                        logo={
                            <img src={PUBLIC_URL('images/social/discord-grey.png')} style={{ width: '23px', marginLeft: '4px', marginRight: '2px' }} />
                        }
                        placeHolder="https://discord.gg/"
                        state={user.discord}
                        onChange={onSiteChange}
                        name="discord"
                        type='url'
                    />
                    <SocialLinkInput
                        logo={
                            <InstagramIcon sx={{ fontSize: '30px' }} />
                        }
                        placeHolder="https://www.instagram.com/"
                        state={user.instagram}
                        onChange={onSiteChange}
                        name="instagram"
                        type='url'
                    />
                    <SocialLinkInput
                        logo={
                            <TelegramIcon sx={{ fontSize: '30px' }} />
                        }
                        placeHolder="https://t.me/"
                        state={user.telegram}
                        onChange={onSiteChange}
                        name="telegram"
                        type='url'
                    />
                    <hr style={{ margin: '20px 0px' }}></hr>
                    {apiLoading ?
                        <TxtButton
                            text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                            borderColor="rgba(27, 127, 153, 1)"
                            width='190px' />
                        :
                        <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                            <TxtButton
                                text="Submit"
                                bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                borderColor="rgba(27, 127, 153, 1)"
                                onClick={handleSubmit}
                            />
                        </div>
                    }
                    {successMessage ?
                        <Typography sx={{ margin: '20px 0px', color: theme.pallete.lightBlue }}>
                            {successMessage}
                        </Typography>
                        :
                        undefined
                    }
                    {errorMessage ? <Typography sx={{ margin: '20px 0px', color: 'red' }}>
                        {errorMessage}
                    </Typography>
                        :
                        undefined
                    }
                </Box>
            }
        </Box >
    )
}
