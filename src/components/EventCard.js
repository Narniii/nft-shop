import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { BG_URL, PUBLIC_URL } from '../utils/utils'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import './EventCard.css'
import { API_CONFIG } from '../config';
import { useSelector } from 'react-redux';
import { COLLECTION_API } from '../data/collection_api';
import { SettingsPowerRounded } from '@mui/icons-material';
import { EVENT_API } from '../data/event_api';
import EventParticipants from '../pages/Events/EventParticipantModal';
import { useSearchParams } from 'react-router-dom'



export default function EventCard({ event, creator }) {
    const theEvent = event.event
    const this_time = new Date(Date.now())
    useEffect(() => {
        if (new Date(theEvent.expire_at / 1000000) < this_time)
            setIsExpired(true)
    }, [])
    const userDetails = useSelector(state => state.userReducer)
    const [err, setErr] = useState(undefined)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [isParticipated, setIsParticipated] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isExpired, setIsExpired] = useState(false)
    const [loginAlerting, setLoginAlerting] = useState(false)
    let [searchParams, setSearchParams] = useSearchParams();
    const urlStatus = searchParams.get('status')
    const transactionHashes = searchParams.get('transactionHashes')
    const [open, setOpen] = useState(false)
    const openModal = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    };

    console.log('-------------------')
    const day = new Date(theEvent.created_at / 1000000).getDate()
    // console.log(day)
    var month = new Date(theEvent.created_at / 1000000).toLocaleString('default', { month: 'long' });
    // console.log(month)
    const year = new Date(theEvent.created_at / 1000000).getFullYear()
    // console.log(year)
    // console.log(theEvent)
    const apiCall = useRef(undefined)

    const [count_down, setCount_down] = useState(undefined)
    const theInterval = useRef(null)

    // const [timer, setTimer] = useState(undefined)
    // useEffect(() => {
    //     return () => {
    //         if (theInterval.current)
    //             clearInterval(theInterval.current);
    //     };
    // }, [])

    const CountDown = () => {
        var difference;
        var q;
        if (theEvent && !isExpired)
            switch (true) {
                case (this_time < new Date(theEvent.created_at / 1000000)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(theEvent.created_at / 1000000).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to start"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to start"
                    break;
                case (new Date(theEvent.created_at / 1000000) < this_time && this_time < new Date(theEvent.expire_at / 1000000)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(theEvent.expire_at / 1000000).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to finish"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to finish"
                    break;
                case (new Date(theEvent.expire_at / 1000000) < this_time && new Date(theEvent.created_at / 1000000) < this_time):
                    setCount_down("-- : -- : -- : --")
                    q = " this event is expired "
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
                {/* {count_down_text.toString()} */}
                {count_down != undefined ? <p>{count_down}{q}</p> : undefined}
            </>
        )
    }


    useEffect(() => {
        if (userDetails && userDetails.userWallet) {
            if (userDetails.userWallet == creator)
                setIsCreator(true)
            if (theEvent.participants != null)
                if (theEvent.participants.length != 0)
                    for (var i = 0; i < theEvent.participants.length; i++) {
                        if (userDetails.userWallet == theEvent.participants[i].nft_owner_id)
                            setIsParticipated(true)
                    }
        }
    }, [userDetails])


    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            if (theInterval.current)
                clearInterval(theInterval.current);
        }
    }, [])

    const participate = async () => {
        if (userDetails.isLoggedIn) {
            try {
                const res = await userDetails.eventContract.vote({
                    args: {
                        event_id: event.event_id,
                        participant: {
                            nft_owner_id: userDetails.userWallet,
                        },
                    },
                    accountId: userDetails.eventContract.account.accountId,
                    amount: "1"
                });
                console.log(res)
                // try {
                //     apiCall.current = EVENT_API.request({
                //         path: `/event/ver/par/`,
                //         method: "post",
                //         body: { event_id: theEvent._id.$oid.toString(), participant: userDetails.userWallet },
                //     });
                //     let response = await apiCall.current.promise;
                //     console.log(response)
                //     if (!response.isSuccess)
                //         throw response
                //     setSuccessMesssage("you are now one of this events participators")
                //     setErr(undefined)
                //     setIsParticipated(true)
            }
            catch (err) {
                if (err.status == 403) {
                    setErr("you must be an nft owner of the collection to participate in the event")
                }
                else {
                    setErr("internal server error")
                }
                console.log(err)
            }
        } else {
            setErr("You must login first to continue.")
        }
    }
    return (
        <>
            <Box>
                <Box className="event-card" sx={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', background: '#3a3d4d', color: 'black', width: '80%', margin: '0px auto', height: 400, boxShadow: '0px 0px 20px 10px rgba(0,0,0,0.3)' }}>
                        <Box sx={{ flex: 5, position: 'relative' }}>
                            <Box
                                sx={{
                                    backgroundImage: BG_URL(`${theEvent.media}`),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    position: "absolute",
                                    top: -30,
                                    left: { lg: 20, md: 10, xs: 5 },
                                    width: '95%',
                                    height: { lg: 300, xs: "200px" },
                                    boxShadow: '0px 0px 20px 5px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Box className="text-center" sx={{ marginTop: { md: "270px", lg: "unset" } }}>
                                <Typography sx={{
                                    position: "absolute",
                                    left: '30px',
                                    bottom: '10px',
                                    fontSize: "3rem",
                                    display: { sm: "inline-block", lg: "unset" },
                                    color: '#9b9b9b'
                                }}>
                                    {day}
                                </Typography>
                                <Typography sx={{
                                    position: 'absolute',
                                    left: '30px',
                                    bottom: '-5px',
                                    fontSize: "1rem",
                                    color: '#C3C3C3'
                                }}>
                                    {month}&nbsp;{year}
                                </Typography>
                            </Box>
                            {/* <Box sx={{ display: { md: "none", lg: "block", } }}>
                                <ul style={{ position: 'absolute', bottom: "1%", right: 0 }}>
                                    <li style={{ cursor: 'pointer' }}><RemoveRedEyeIcon /></li>
                                    <li style={{ cursor: 'pointer' }}><FavoriteIcon /></li>
                                    <li style={{ cursor: 'pointer' }}><EmailIcon /></li>
                                    <li style={{ cursor: 'pointer' }}><ShareIcon /></li>
                                </ul>
                            </Box>
                            <Box sx={{ display: { md: "flex", lg: "none" } }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><RemoveRedEyeIcon /></div>
                                    <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><FavoriteIcon /></div>
                                    <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><EmailIcon /></div>
                                    <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><ShareIcon /></div>
                                </div>
                            </Box> */}
                        </Box>
                        <Box sx={{ flex: 3, display: 'flex', padding: '10px ', flexDirection: 'column', position: "relative" }}>
                            {theEvent.title ?
                                <Typography variant='h6' sx={{
                                    color: 'darkgrey'
                                }}>
                                    {theEvent.title.length > 80 ? theEvent.title.substring(0, 80) + '...' : theEvent.title}
                                </Typography>
                                : undefined}
                            <Box sx={{ background: '#8d8f99', padding: '5px 10px', width: 'fit-content', borderRadius: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Box sx={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundImage: BG_URL(PUBLIC_URL('images/kaf.jpg')),
                                    // backgroundImage: `url(${API_CONFIG.EVENTS_API_URL}/${theEvent.media})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                }}></Box>
                                <Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>aqua</Typography>
                            </Box>
                            <Box sx={{ borderBottom: '2px solid darkgray', margin: '10px 0px' }}></Box>
                            <Typography sx={{ color: 'lightgrey' }}>
                                {theEvent.content ? <>
                                    {theEvent.content.length > 300 ? theEvent.content.substring(0, 300) + '...' : theEvent.content}
                                </> : undefined}
                            </Typography>
                            <Box>
                                {theEvent.participants != null ?
                                    <Typography sx={{ color: "white", cursor: "pointer" }}
                                        onClick={openModal}
                                    >participants : {theEvent.participants.length}</Typography>
                                    : <Typography sx={{ color: "white", cursor: "pointer" }}
                                        onClick={openModal}
                                    >participants : 0</Typography>}
                            </Box>
                            {isExpired ? <Box sx={{ marginTop: "80px" }}><Typography sx={{ color: "orange" }}>this event is expired</Typography></Box> : <Box>
                                <Box sx={{ marginTop: "80px" }}>
                                    <Typography sx={{ color: "orange" }}><CountDown /></Typography>
                                </Box>
                                <Box sx={{ marginTop: "30px" }}>
                                    {err ? <Typography sx={{ fontSize: "12px", color: 'red', margin: '10px 0px' }}>{err}</Typography> : undefined}
                                    {successMesssage ? <Typography sx={{ color: 'green', margin: '20px 0px' }}>{successMesssage}</Typography> : undefined}
                                </Box>
                                {isCreator ? <Typography sx={{ fontSize: "15px", color: 'gray', margin: '10px 0px' }}>you are the creator of the event</Typography> : <>
                                    {isParticipated ?
                                        <>
                                            <Typography sx={{ color: 'white', fontSize: '14px' }}> you are one of the participators</Typography>
                                            {transactionHashes ?
                                                <Typography className="new-mint-wrap" sx={{ color: 'white', fontSize: '12px' }}> Tx hash: <br></br>{transactionHashes}</Typography>
                                                : undefined}
                                        </>
                                        :
                                        <>{new Date(theEvent.created_at / 1000000) < this_time ?
                                            <Box onClick={participate} className="text-center" sx={{ fontSize: "12px", borderRadius: "10px", backgroundColor: "#33343f", width: "120px", height: "40px", padding: "12px", cursor: "pointer", textAlign: "center", bottom: "5%", right: "5%", position: "absolute" }}>
                                                <p style={{ color: "white", margin: "0" }} className="text-center">Participate</p>
                                            </Box>
                                            : undefined}
                                        </>
                                    }
                                </>}
                            </Box>}
                        </Box>
                    </Box>
                </Box>

                {/* <EventParticipants open={open} onClose={handleClose} participant={theEvent.participants} /> */}

            </Box>



            {/* tablet card */}
            {/* <Box className="tablet-only">
                <Box className="event-card" sx={{ height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', background: '#3a3d4d', color: 'black', width: '80%', margin: '0px auto', height: 400, boxShadow: '0px 0px 20px 10px rgba(0,0,0,0.3)' }}>
                        <Box sx={{ flex: 5, position: 'relative' }}>
                            <Box
                                sx={{
                                    backgroundImage: BG_URL(`${API_CONFIG.EVENTS_API_URL}${theEvent.media}`),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    position: 'absolute',
                                    top: '-30px',
                                    left: 10,
                                    width: '95%',
                                    height: '300px',
                                    boxShadow: '0px 0px 20px 5px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Box className="text-center" sx={{ marginTop: '270px' }}>
                                <Typography sx={{
                                    fontSize: '3rem',
                                    color: '#9b9b9b',
                                    display: 'inline-block'
                                }}>
                                    {day}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1.5rem',
                                    color: '#C3C3C3',
                                    display: 'inline-block'
                                }}>
                                    {month}&nbsp;{year}
                                </Typography>
                            </Box>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><RemoveRedEyeIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><FavoriteIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><EmailIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><ShareIcon /></div>
                            </div>
                        </Box>
                        <Box sx={{ flex: 3, display: 'flex', padding: '10px ', flexDirection: 'column', position: "relative" }}>
                            <Typography variant='h6' sx={{
                                color: 'darkgrey'
                            }}>
                                {theEvent.title.length > 50 ? theEvent.title.substring(0, 50) + '...' : theEvent.title}
                            </Typography>
                            <Box sx={{ background: '#8d8f99', padding: '5px 10px', width: 'fit-content', borderRadius: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Box sx={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundImage: BG_URL(PUBLIC_URL('images/kaf.jpg')),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                }}></Box>
                                <Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>aqua</Typography>
                            </Box>
                            <Box sx={{ borderBottom: '2px solid darkgray', margin: '10px 0px' }}></Box>
                            <Typography sx={{ color: 'lightgrey' }}>
                                {theEvent.content ? <>
                                    {theEvent.content.length > 100 ? theEvent.content.substring(0, 100) + '...' : theEvent.content}
                                </> : undefined}
                            </Typography>
                            <Box sx={{ marginTop: "80px" }}>
                                <Typography sx={{ color: "orange" }}>{CountDown(theEvent)}</Typography>
                            </Box>
                            <Box onClick={participate} sx={{ borderRadius: "10px", backgroundColor: "#33343f", width: "120px", height: "30px", padding: "2px", cursor: "pointer", textAlign: "center", bottom: "5%", right: "5%", position: "absolute" }}>
                                <p style={{ color: "white" }}>Participate</p>
                            </Box>
                        </Box>
                    </Box>
                </Box >
            </Box> */}




            {/*mobile card */}
            {/* <Box className="mobile-only">
                <Box className="event-card" sx={{ height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', background: '#3a3d4d', color: 'black', width: '80%', margin: '0px auto', height: 500, boxShadow: '0px 0px 20px 10px rgba(0,0,0,0.3)', flexDirection: 'column' }}>
                        <Box sx={{ flex: 5, position: 'relative' }}>
                            <Box
                                sx={{
                                    backgroundImage: BG_URL(`${API_CONFIG.EVENTS_API_URL}${theEvent.media}`),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    width: '100%',
                                    height: '200px',
                                    boxShadow: '0px 0px 20px 5px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Box className="text-center">
                                <Typography sx={{
                                    fontSize: '2rem',
                                    color: '#9b9b9b',
                                    display: 'inline-block',
                                }}>
                                    {day}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1rem',
                                    color: '#C3C3C3',
                                    display: 'inline-block',
                                }}>
                                    {month}&nbsp;{year}
                                </Typography>
                            </Box>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><RemoveRedEyeIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><FavoriteIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><EmailIcon /></div>
                                <div style={{ cursor: 'pointer', color: '#7B7B7B', fontSize: '30px' }}><ShareIcon /></div>
                            </div>
                        </Box>
                        <Box sx={{ flex: 3, display: 'flex', padding: '10px ', flexDirection: 'column', position: "relative" }}>
                            <Typography variant='h6' sx={{
                                color: 'darkgrey'
                            }}>
                                {theEvent.title.length > 25 ? theEvent.title.substring(0, 25) + '...' : theEvent.title}
                            </Typography>
                            <Box sx={{ background: '#8d8f99', padding: '5px 10px', width: 'fit-content', borderRadius: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '5px auto' }}>
                                <Box sx={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundImage: BG_URL(PUBLIC_URL('images/kaf.jpg')),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                }} />
                                <Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>aqua</Typography>
                            </Box>
                            <Box sx={{ borderBottom: '2px solid darkgray', margin: '10px 0px' }}></Box>
                            <Typography sx={{ color: 'lightgrey' }}>
                                {theEvent.content ? <>
                                    {theEvent.content.length > 50 ? theEvent.content.substring(0, 50) + '...' : theEvent.content}
                                </> : undefined}
                            </Typography>
                            <Box sx={{ marginTop: "40px" }}>
                                <Typography sx={{ color: "orange" }}>{CountDown(theEvent)}</Typography>
                            </Box>
                            <Box onClick={participate} sx={{ borderRadius: "10px", backgroundColor: "#33343f", width: "120px", height: "30px", padding: "2px", cursor: "pointer", textAlign: "center", bottom: "5%", right: "5%", position: "absolute" }}>
                                <p style={{ color: "white" }}>Participate</p>
                            </Box>
                        </Box>
                    </Box>
                </Box >
            </Box> */}
        </>
    )
}
