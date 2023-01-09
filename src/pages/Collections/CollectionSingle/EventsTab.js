import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CardWithBordersAndBgColor from '../../../components/CardWithBordersAndBgColor'
import CardWithTitle from '../../../components/CardWithTitle'
import TxtButton from '../../../components/TxtButton'
import { BG_URL, PUBLIC_URL } from '../../../utils/utils'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { API_CONFIG } from '../../../config'
import axios from 'axios'
import EventCard from '../../../components/EventCard'
import { EVENT_API } from '../../../data/event_api'
import { useSelector } from 'react-redux';

export default function EventsTab({ collection }) {
    const userDetails = useSelector(state => state.userReducer)

    const theme = useTheme()
    console.log(collection)
    const [events, setEvents] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const apiCall = useRef(undefined)
    var this_time = new Date(Date.now())
    const [errMsg, setErrMsg] = useState(undefined)
    useEffect(() => {
        // fetchCollections()
        getEvents()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])

    const getEvents = async () => {
        try {
            const res = await userDetails.eventContract.get_all_events_by_collection({
                "collection_name": collection.title,
            });
            console.log(res)
            setEvents(res)

            // apiCall.current = EVENT_API.request({
            //     path: `/event/col/`,
            //     method: "post",
            //     body: { collection_id: collection._id.$oid },
            // });
            // let response = await apiCall.current.promise;
            // console.log(response)
            // if (!response.isSuccess)
            //     throw response
            // console.log(response)
            // setEvents(response.data)
        }
        catch (err) {
            console.log(err)
            if (err.status == 404) {
                setEvents([])
            }
            else {
                setErrMsg("We're sorry , something is wrong with the server. Please try again later. Will be fixed asap")
            }

        }
    }

    useEffect(() => {
        if (events != undefined)
            setLoading(false)
    }, [events])
    return (
        <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' } }}>
            {loading ? <Box className='text-center' sx={{ paddingTop: '20px' }} ><CircularProgress /> </Box> :
                <>
                    {events.length != 0 ?
                        <div className='row'>
                            {console.log(events)}
                            {
                                events.map((event, index) => {
                                    return <EventCard event={event} creator={collection.creator} key={index} />
                                })
                            }
                        </div>
                        : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '30vh' }}>
                            <Typography variant='h4' sx={{ textAlign: 'center', color: theme.pallete.lightBlue }}>No events found</Typography>
                        </Box>
                    }
                    {errMsg ? <Box className='text-center' sx={{ paddingTop: '20px', color: "red" }} >{errMsg}</Box> : undefined}
                </>
            }
        </Box >
    )
}
