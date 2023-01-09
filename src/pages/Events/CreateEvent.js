import axios from "axios";
import { API_CONFIG, NFT_STORAGE_API_KEY } from "../../config";
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from "react";
import { CircularProgress, TextField, Typography, useTheme } from "@mui/material";
import LoginAlert from "../../components/LoginAlert";
import InputTitles from "../../components/InputTitles";
import { Box } from "@mui/system";
import TxtButton from "../../components/TxtButton";
import { Link, useSearchParams } from "react-router-dom";
import CustomTitle from "../../components/CustomTitle";
import { PUBLIC_URL } from "../../utils/utils";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { COLLECTION_API } from "../../data/collection_api";
import { EVENT_API } from "../../data/event_api";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { utils } from "near-api-js";

const CreateEvent = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const transactionHashes = searchParams.get('transactionHashes')


    const userDetails = useSelector(state => state.userReducer)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [loginAlerting, setLoginAlerting] = useState(false)
    const [fetchedCollections, setFetchedCollections] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [collectionErr, setCollectionErr] = useState(undefined)
    const [thisEvent, setThisEvent] = useState({
        nft_collection_id: -1,
        description: undefined,
        img: undefined,
        title: undefined,
        issued_at: undefined,
        expires_at: undefined,
        extra: undefined,
        wallet_address: userDetails.userWallet
    })
    const [imageChanged, setImageChanged] = useState(false)
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [extras, setExtras] = useState({})
    const [apiLoading, setApiLoading] = useState(false)

    const apiCall = useRef(undefined)
    const theme = useTheme()
    useEffect(() => {
        if (fetchedCollections != undefined) {
            setLoading(false)
        }
    }, [fetchedCollections])
    useEffect(() => {
        if (userDetails.isLoggedIn == true) {
            setLoginAlerting(false)
            fetchCollections()
        } else {
            setLoginAlerting(true)
        }
    }, [userDetails])

    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])
    const fetchCollections = async () => {
        const formData = new FormData();
        // formData.append("user_id", userDetails.userId)
        formData.append("wallet_address", userDetails.userWallet)
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/col/user/`,
                method: "post",
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
            let response = await apiCall.current.promise;
            console.log(response)
            if (!response.isSuccess)
                throw response
            setFetchedCollections(response.data)
        }
        catch (err) {
            console.log(err)
            if (err.status === 404) {
                setFetchedCollections([])
            }
            else setErr(err)

        }
    }
    const onChange = e => {
        var n = { ...thisEvent };
        n[e.target.name] = e.target.value;
        setThisEvent(n);
    }
    const addToExtras = e => {
        var n = { ...extras }
        n[e.target.name] = e.target.value
        setExtras(n)
    }
    const handleFile = (e) => {
        var n = { ...thisEvent };
        n.img = e.target.files[0];
        // console.log(n)
        setThisEvent(n);
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
        setApiLoading(true)
        setCollectionErr(undefined)
        setErr(undefined)
        if (thisEvent.img === undefined) {
            setErr('Please select an image for your event.')
            setApiLoading(false)
            return
        }
        else if (thisEvent.title.length == 0) {
            setErr('Please enter your event title')
            setApiLoading(false)
            return
        }
        else if (thisEvent.nft_collection_id === -1) {
            setCollectionErr(true)
            setApiLoading(false)
            return
        }
        else if (startTime == undefined) {
            setErr('please select a start time for your event.')
            setApiLoading(false)
            return
        }
        else if (finishTime == undefined) {
            setErr('please select an expire time for your event.')
            setApiLoading(false)
            return
        }
        else {
            setErr(undefined)
            setCollectionErr(undefined)
        }
        const formData = new FormData();
        formData.append('nft_collection_id', thisEvent.nft_collection_id);
        formData.append('media', thisEvent.img);
        formData.append('title', thisEvent.title)
        formData.append('issued_at', startTime ? startTime : undefined);
        formData.append('expires_at', finishTime ? finishTime : undefined);
        formData.append('extra', JSON.stringify({ description: thisEvent.description }));
        formData.append('wallet_address', userDetails.userWallet);

        var ipfsCid = await ipfsUpload()
        var ipfsUrl = `https://${ipfsCid}.ipfs.dweb.link/`

        try {
            var tt = startTime.getTime()
            var _start = parseInt(tt)
            var hh = finishTime.getTime()
            var _finish = parseInt(hh)
            const res = await userDetails.eventContract.create({
                args: {
                    event_id: Math.floor(100000000 + Math.random() * 900000000).toString(),
                    event: {
                        title: thisEvent.title,
                        content: thisEvent.description,
                        media: ipfsUrl,
                        collection_name: thisEvent.nft_collection_id,
                        collection_creator_id: userDetails.userWallet,
                        created_at: startTime ? _start * 1000000 : 0,
                        expire_at: finishTime ? _finish * 1000000 : 0,
                        is_expired: false,
                        is_locked: false,
                        participants:[]
                    },
                },
                accountId: userDetails.eventContract.account.accountId,
                amount: "6090000000000000000000"
            });
            console.log(res)

            // apiCall.current = EVENT_API.request({
            //     path: `/event/create/`,
            //     method: "post",
            //     body: formData,
            // });
            // let response = await apiCall.current.promise;
            // console.log(response)
            // if (!response.isSuccess)
            //     throw response
            // setSuccessMesssage("event created successfully")
        }
        catch (err) {
            console.log(err)
            setErr(err.message)

        }
        // try {
        //     const response = await axios({
        //         method: "post",
        //         url: `${API_CONFIG.EVENTS_API_URL}/event/create/`,
        //         data: formData,
        //     });
        //     console.log(response)
        //     if (response.status == 201) {
        //         setSuccessMesssage("event created successfully")
        //         setApiLoading(false)
        //     }
        // }
        // catch (err) {
        //     console.log(err)
        //     setErr(err.response.data.message)
        // }
    }
    useEffect(() => {
        if (successMesssage)
            setApiLoading(false)
    }, [successMesssage])

    const ipfsUpload = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `https://api.nft.storage/upload`,
                data: thisEvent.img,
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
    return (
        <section className='container'>
            {transactionHashes ? (
                <>
                    <Box sx={{padding:"20px" , margin:"50px"}}>
                        <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                            event created successfully
                        </Typography>
                        <Typography sx={{ color: theme.pallete.lightBlue }}>transaction hash:</Typography>
                        <Typography> {transactionHashes}</Typography>
                    </Box>
                </>
            ) : <>
                {loginAlerting ? <LoginAlert /> :
                    <>
                        {loading ? <CircularProgress /> :
                            <div>
                                <CustomTitle variant="h1" text="Create New Event" margin="10px 0px" fontWeight="bold" />
                                <div style={{ height: '50px' }}>
                                    <span style={{ color: '#1593b2', fontSize: 50, verticalAlign: 'top' }}>*</span>
                                    <span style={{ verticalAlign: 'sub', color: '#999a9f' }}>Required Fields</span>
                                </div>
                                <InputTitles isRequired={true} variant="h2" title="event banner image" isBold={true} explanation="File types supported: JPG,  PNG, SVG, WEBM" />
                                <div style={{ margin: '10px 0px' }}>
                                    <span style={{ color: '#1593b2' }}>Note: </span>
                                    <span style={{ color: '#999a9f' }}>Maximum file size should be 100MB</span>
                                </div>
                                <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '30%', padding: imageChanged ? '10px' : '100px', borderRadius: '20px', }}>
                                    <label onChange={handleFile} htmlFor="formId">
                                        <input type="file" id="formId" hidden />
                                        {imageChanged ?
                                            <img id="output" style={{ width: '100%', cursor: 'pointer' }} />
                                            :
                                            <img src={PUBLIC_URL('images/image-icon.png')} style={{ width: '100%', cursor: 'pointer' }} />
                                        }
                                    </label>
                                </div>
                                <div className='nft-custom-inputs-wrapper'>
                                    <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                                    <input onChange={onChange} name="title" type="text" className="form-control" placeholder="event Name" />
                                    <InputTitles title="Description" variant="h2" isBold={true} marginTop="40px" />
                                    <textarea name="description" onChange={onChange} type="text" className="form-control" placeholder="Provide a detailed description about your event" />
                                    <InputTitles title="Collection" variant="h2" isBold={true} marginTop="40px" explanation="This is the collection where your event will accrue on" />
                                    <select name="nft_collection_id" onChange={onChange} className="form-select">
                                        {fetchedCollections.length !== 0 ?
                                            <>
                                                <option key={-1} value={-1}>Select a collection</option>
                                                {fetchedCollections.map((collection, index) => {
                                                    return <option value={collection.title} key={index}>{collection.title}</option>
                                                })}
                                            </>
                                            :
                                            <>
                                                <option value={-1}>You must create collection first.</option>
                                            </>
                                        }
                                    </select>

                                    <Typography sx={{ margin: '20px 0px', color: '#999a9f' }}>You can create new collections <Link to="/create/collection">Here</Link>.</Typography>
                                    <div className='create-col-reveal-wrapper'>
                                        <Box sx={{ color: 'white', marginTop: '20px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="start time" value={startTime} onChange={(value, event) => { setStartTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box sx={{ color: 'white', marginTop: '20px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="expire time" value={finishTime} onChange={(value, event) => { setFinishTime(value) }} renderInput={(params) => <TextField {...params} />} />
                                            </LocalizationProvider>
                                        </Box>
                                    </div>
                                    {/* <Box sx={{ width: { xs: "300px", sm: "350px" } }}>
                                    <Box>
                                        <InputTitles title="start time" variant="h2" isBold={true} marginTop="40px" explanation="select a start time for your event" />
                                        <Calendar onChange={(value, event) => { setStartTime(value) }} />
                                    </Box>
                                    <Box>
                                        <InputTitles title="expire time" variant="h2" isBold={true} marginTop="40px" explanation="select an expire time for your event" />
                                        <Calendar onChange={(value, event) => { setFinishTime(value) }} />
                                    </Box>
                                </Box> */}
                                    <hr style={{ margin: '70px 0px' }} />
                                    <Box sx={{ width: '10%' }}>
                                        {apiLoading ?
                                            <TxtButton
                                                text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                                bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                borderColor="rgba(27, 127, 153, 1)"
                                                width='190px' />
                                            :
                                            <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                                                <TxtButton
                                                    text="Create Event"
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)" />
                                            </div>
                                        }
                                    </Box>

                                    {collectionErr ?
                                        <div>
                                            <Typography sx={{ color: 'red' }}>Please choose a collection for your event.</Typography>
                                            <Typography sx={{ color: 'red' }}>If you didn't create a collection yet, <Link to="/create/collection">Create one.</Link></Typography>
                                        </div>
                                        : undefined}
                                    {err ? <Typography sx={{ color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                                    {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                                </div>
                            </div>
                        }
                    </>
                }
            </>}
        </section>
    );
}

export default CreateEvent;