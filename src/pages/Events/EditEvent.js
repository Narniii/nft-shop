import axios from "axios";
import { API_CONFIG } from "../../config";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import LoginAlert from "../../components/LoginAlert";
import InputTitles from "../../components/InputTitles";
import { Box } from "@mui/system";
import TxtButton from "../../components/TxtButton";
import { Link, useParams } from "react-router-dom";
import CustomTitle from "../../components/CustomTitle";
import { PUBLIC_URL } from "../../utils/utils";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const EditEvent = () => {
    const id = useParams()
    const userDetails = useSelector(state => state.userReducer)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [loginAlerting, setLoginAlerting] = useState(false)
    const [fetchedCollections, setFetchedCollections] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [collectionErr, setCollectionErr] = useState(undefined)
    const controller = new AbortController();
    const [thisEvent, setThisEvent] = useState({
        nft_collection_id: -1,
        img: undefined,
        title: undefined,
        issued_at: undefined,
        expires_at: undefined,
        extra: undefined,
        wallet_address: undefined
    })
    const [apiLoading, setApiLoading] = useState(false)
    const theme = useTheme()
    const [imageChanged, setImageChanged] = useState(false)
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [extras, setExtras] = useState({})
    const [noEvent, setNoEvent] = useState(false)


    useEffect(() => {
        if (userDetails.isLoggedIn == true) {
            setLoginAlerting(false)
            getEvent()
        } else {
            setLoginAlerting(true)
        }
    }, [userDetails])
    const getEvent = async () => {
        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.EVENTS_API_URL}/event/get/`,
                data: { event_id: id.id },
            });
            console.log(response)
            if (response.status == 200) {
                setThisEvent(response.data.data)
                // fetchCollections()
                setLoading(false)
            }
        }
        catch (err) {
            console.log(err)
            setNoEvent(true)
            setLoading(false)
        }
    }
    // const fetchCollections = async () => {
    //     const formData = new FormData();
    //     formData.append("user_id", userDetails.userId)
    //     formData.append("wallet_address", userDetails.userWallet)
    //     try {
    //         const response = await axios({
    //             method: "post",
    //             url: `${API_CONFIG.COLLECTIONS_API_URL}/cmd/col/user/`,
    //             data: formData,
    //             headers: {
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //             },
    //             signal: controller.signal
    //         });
    //         console.log(response)
    //         if (response.status == 200) {
    //             setFetchedCollections(response.data.data)
    //             setLoading(false)
    //         }
    //     }
    //     catch (err) {
    //         console.log(err)
    //         if (err.response.data.message === "No Collection Found") {
    //             setFetchedCollections([])
    //             setLoading(false)
    //         }
    //         else setErr(err)
    //     }
    // }
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
        // if (thisEvent.img === undefined) {
        //     setErr('Please select an image for your event.')
        //     setApiLoading(false)
        //     return
        // }
        //else if (thisEvent.title.length == 0) {
        //     setErr('Please enter your event title')
        //     setApiLoading(false)
        //     return
        // }
        // else if (thisEvent.nft_collection_id === -1) {
        //     setCollectionErr(true)
        //     setApiLoading(false)
        //     return
        // }
        // else if (startTime == undefined) {
        //     setErr('please select a start time for your event.')
        //     setApiLoading(false)
        //     return
        // }
        // else if (finishTime == undefined) {
        //     setErr('please select an expire time for your event.')
        //     setApiLoading(false)
        //     return
        // }
        // else {
        //     setErr(undefined)
        //     setCollectionErr(undefined)
        // }
        const formData = new FormData();
        formData.append('event_id', id.id);
        formData.append('nft_collection_id', thisEvent.nft_collection_id);
        // formData.append('media', thisEvent.img);
        formData.append('title', thisEvent.title)
        formData.append('issued_at', startTime ? startTime : thisEvent.issued_at);
        formData.append('expires_at', finishTime ? finishTime : thisEvent.expires_at);
        formData.append('extra', JSON.stringify({ description: thisEvent.description }));

        try {
            const response = await axios({
                method: "post",
                url: `${API_CONFIG.EVENTS_API_URL}/event/edit/`,
                data: formData,
            });
            console.log(response)
            if (response.status == 200) {
                setSuccessMesssage("event edited successfully")
                setApiLoading(false)
            }
        }
        catch (err) {
            console.log(err)
            setErr(err.response.data.message)
        }
    }

    return (
        <section className='container'>
            {loginAlerting ? <LoginAlert /> :
                <>
                    {loading ? <CircularProgress /> :
                        <>
                            {noEvent ?
                                <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '40vh', flexDirection: 'column', color: "orange" }}>
                                    something is not right
                                </Box>
                                :
                                <>
                                    {userDetails.userWallet == thisEvent.collection_creator_id ?
                                        <div>
                                            <CustomTitle variant="h1" text="Edit Event" margin="10px 0px" fontWeight="bold" />
                                            <div style={{ height: '50px' }}>
                                                <span style={{ color: '#1593b2', fontSize: 50, verticalAlign: 'top' }}>*</span>
                                                <span style={{ verticalAlign: 'sub', color: '#999a9f' }}>Required Fields</span>
                                            </div>
                                            <InputTitles isRequired={false} variant="h2" title="event banner image" isBold={true} explanation="File types supported: JPG,  PNG, SVG, WEBM" />
                                            <div style={{ margin: '10px 0px' }}>
                                                <span style={{ color: '#1593b2' }}>Note: </span>
                                                <span style={{ color: '#999a9f' }}>Maximum file size should be 100MB</span>
                                            </div>
                                            <div style={{ border: `2px dashed ${theme.pallete.lightBorder}`, width: '30%', padding: '100px', borderRadius: '20px', }}>
                                                <label onChange={handleFile} htmlFor="formId">
                                                    <input type="file" id="formId" hidden />
                                                    {imageChanged ?
                                                        <img id="output" style={{ width: '100%', cursor: 'pointer' }} />
                                                        :
                                                        <img src={thisEvent.media} style={{ width: '100%', height: "100%", cursor: 'pointer' }} />
                                                    }
                                                </label>
                                            </div>
                                            <div className='nft-custom-inputs-wrapper'>
                                                <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={false} />
                                                <input onChange={onChange} name="title" type="text" className="form-control" placeholder={thisEvent.title} />
                                                <InputTitles title="Description" variant="h2" isBold={true} marginTop="40px" />
                                                <textarea name="description" onChange={addToExtras} type="text" className="form-control" placeholder={thisEvent.extra.description} />
                                                {/* <InputTitles title="Collection" variant="h2" isBold={true} marginTop="40px" explanation="This is the collection where your event will accrue on" />
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
                                </select> */}

                                                <Typography sx={{ margin: '20px 0px', color: '#999a9f' }}>You can create new collections <Link to="/create/collection">Here</Link>.</Typography>
                                                <Box sx={{ width: { xs: "300px", sm: "350px" } }}>
                                                    <Box>
                                                        <InputTitles title="start time" variant="h2" isBold={true} marginTop="40px" explanation="select a start time for your event" />
                                                        <Calendar onChange={(value, event) => { setStartTime(value) }} />
                                                    </Box>
                                                    <Box>
                                                        <InputTitles title="expire time" variant="h2" isBold={true} marginTop="40px" explanation="select an expire time for your event" />
                                                        <Calendar onChange={(value, event) => { setFinishTime(value) }} />
                                                    </Box>
                                                </Box>
                                                <hr style={{ margin: '70px 0px' }} />
                                                <Box sx={{ width: '10%' }}>
                                                    {apiLoading ?
                                                        <TxtButton text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />} bgColor="#1593b2" width='100px' />
                                                        :
                                                        <div style={{ width: 'fit-contet', cursor: 'pointer' }} onClick={handleSubmit}>
                                                            <TxtButton text="submit" bgColor="#1593b2" />
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
                                        :
                                        <Box sx={{ width: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', minHeight: '40vh', flexDirection: 'column' }}>
                                            you are not the creator of this event
                                        </Box>
                                    }
                                </>
                            }

                        </>
                    }
                </>
            }
        </section>
    );
}

export default EditEvent;