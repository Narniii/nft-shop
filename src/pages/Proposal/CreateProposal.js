import { useTheme } from "@emotion/react";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import CustomTitle from "../../components/CustomTitle";
import InputTitles from "../../components/InputTitles";
import LoginAlert from "../../components/LoginAlert";
import TxtButton from "../../components/TxtButton";
import { BITZIO_API } from "../../data/bitzio_api";
import { COLLECTION_API } from "../../data/collection_api";
import { PUBLIC_URL } from "../../utils/utils";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { utils } from "near-api-js";

const CreateProposal = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const transactionHashes = searchParams.get('transactionHashes')

    const userDetails = useSelector(state => state.userReducer)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [loginAlerting, setLoginAlerting] = useState(false)
    const [fetchedCollections, setFetchedCollections] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [collectionErr, setCollectionErr] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [finishTime, setFinishTime] = useState(undefined)
    const [proposal, setproposal] = useState({
        collection_id: -1,
        content: undefined,
        title: undefined,
    })
    const [apiLoading, setApiLoading] = useState(false)
    const apiCall = useRef(undefined)
    const theme = useTheme()
    useEffect(() => {
        if (fetchedCollections) {
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
            if (err.message === "No Collection Found") {
                setFetchedCollections([])
            }
            else setErr(err)

        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiLoading(true)
        setCollectionErr(undefined)
        setErr(undefined)
        if (proposal.collection_id === -1) {
            setCollectionErr(true)
            setApiLoading(false)
            return
        }
        else if (proposal.title.length == 0 || proposal.title == undefined) {
            setErr('Please enter your proposal title')
            setApiLoading(false)
            return
        }
        else if (proposal.content.length == 0 || proposal.content == undefined) {
            setErr('Please enter your proposal content')
            setApiLoading(false)
            return
        }
        else if (startTime == undefined) {
            setErr('please select a start time for your proposal.')
            setApiLoading(false)
            return
        }
        else if (finishTime == undefined) {
            setErr('please select an expire time for your proposal.')
            setApiLoading(false)
            return
        }
        else {
            setErr(undefined)
            setCollectionErr(undefined)
        }
        try {
            var tt = startTime.getTime()
            var _start = parseInt(tt)
            var hh = finishTime.getTime()
            var _finish = parseInt(hh)

            const res = await userDetails.proposalContract.create({
                args: {
                    proposal_id: Math.floor(100000000 + Math.random() * 900000000).toString(),
                    proposal: {
                        title: proposal.title,
                        media: "",
                        content: proposal.content,
                        collection_name: proposal.collection_id,
                        collection_creator_id: userDetails.userWallet,
                        created_at: startTime ? _start * 1000000 : 0,
                        expire_at: finishTime ? _finish * 1000000 : 0,
                        is_expired: false,
                        is_locked: false,
                        upvotes:0,
                        downvotes:0,
                        voters:[],

                    },
                },
                accountId: userDetails.proposalContract.account.accountId,
                amount: "6090000000000000000000"
            });
            console.log(res)

            // apiCall.current = BITZIO_API.request({
            //     path: `/proposal/add`,
            //     method: "post",
            //     body: {
            //         // title: "khdssakd",
            //         // content: "kkjsdhkjadh",
            //         // creator_wallet_address: userDetails.userWallet,
            //         // collection_id: "63062478480cb722f51f8029"
            //         title: proposal.title,
            //         content: proposal.content,
            //         creator_wallet_address: userDetails.userWallet,
            //         collection_id: proposal.collection_id
            //     },
            // });
            // let response = await apiCall.current.promise;
            // console.log(response)
            // if (!response.isSuccess)
            //     throw response
            // setSuccessMesssage("proposal created successfully")
            // setApiLoading(false)
        }
        catch (err) {
            console.log(err)
            setErr(err.message)
            setApiLoading(false)
        }
    }

    const onChange = e => {
        var n = { ...proposal };
        n[e.target.name] = e.target.value;
        setproposal(n);
        console.log(e.target.value)
        console.log(e.target.name)
    }

    return (
        <section className="container">
            {transactionHashes ? (
                <>
                    <Box sx={{ padding: "20px", margin: "50px" }}>
                        <Typography variant="h4" sx={{ color: "green", margin: "20px 0px", fontWeight: 'bold' }}>
                            proposal created successfully
                        </Typography>
                        <Typography sx={{ color: theme.pallete.lightBlue }}>transaction hash:</Typography>
                        <Typography sx={{fontSize:{xs:"10px",md:"14px"}}}> {transactionHashes}</Typography>
                    </Box>
                </>
            ) : <>
                {loginAlerting ? <LoginAlert /> :
                    <>
                        {loading ? <CircularProgress /> :
                            <div>
                                <CustomTitle variant="h1" text="Create New Proposal" margin="10px 0px" fontWeight="bold" />
                                <div style={{ height: '50px' }}>
                                    <span style={{ color: '#1593b2', fontSize: 50, verticalAlign: 'top' }}>*</span>
                                    <span style={{ verticalAlign: 'sub', color: '#999a9f' }}>Required Fields</span>
                                </div>
                                <div className='nft-custom-inputs-wrapper'>
                                    <InputTitles variant="h2" title="Name" isBold={true} marginTop="60px" isRequired={true} />
                                    <input onChange={onChange} name="title" type="text" className="form-control" placeholder="Proposal Name" />
                                    <InputTitles title="content" variant="h2" isBold={true} marginTop="40px" />
                                    <textarea name="content" onChange={onChange} type="text" className="form-control" placeholder="Provide a detailed description about your proposal" />
                                    <InputTitles title="Collection" variant="h2" isBold={true} marginTop="40px" explanation="This is the collection where your event will accrue on" />
                                    <select name="collection_id" onChange={onChange} className="form-select">
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
                                                    text="Create Proposal"
                                                    bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                                    borderColor="rgba(27, 127, 153, 1)" />
                                            </div>
                                        }
                                    </Box>

                                    {collectionErr ?
                                        <div>
                                            <Typography sx={{ color: 'red' }}>Please choose a collection for your proposal.</Typography>
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

export default CreateProposal;