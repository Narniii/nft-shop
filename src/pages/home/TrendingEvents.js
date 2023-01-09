import { Box, Typography } from "@mui/material";
import React from "react";
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import TxtButton from '../../components/TxtButton';
import CustomSlider from "../../components/CustomSlider";
import CardWithBordersAndBgColor from "../../components/CardWithBordersAndBgColor";
import CardWithTitle from "../../components/CardWithTitle";
import EventCard from "../../components/EventCard";
import { events } from './events'
import { Link } from "react-router-dom";
export default function TrendingEvents() {
    return (
        <div className="container">
            <Typography sx={{ textAlign: 'center', margin: '20px 0px', fontWeight: 'bold' }} variant="h2">Trending Events</Typography>
            <div className="slider-container">
                <CustomSlider slidesCount={1}>
                    {events.map((event, index) => {
                        return <div key={index}>
                            <EventCard event={event} />
                            {/* <Box sx={{ width: { xs: '95%', sm: '80%' }, margin: '0 auto' }}>
                                <CardWithBordersAndBgColor boxShadow="0px 0px 10px 0px rgba(0,0,0,0.9)" padding="20px">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div style={{ position: 'relative' }}>
                                                <div className="trending-events-content-image" style={{ backgroundImage: BG_URL(PUBLIC_URL('/images/kaf.jpg')) }} />
                                                <div style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translate(-50%, 0)' }}>
                                                    <TxtButton text="Join Now" bgColor={'#04a5c3'} color="white" borderColor={"#04a5c3"} width="125px" />
                                                </div>
                                                <div style={{
                                                    position: 'absolute',
                                                    background: '#434658',
                                                    border: '2px solid #696b79',
                                                    top: '-20px',
                                                    left: '50%',
                                                    width: { xs: "55%",  md: '40%' },
                                                    transform: 'translate(-50%, 0)',
                                                    textAlign: 'center',
                                                    padding: '5px',
                                                    borderRadius: '10px',
                                                }}> Meeting</div >
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="trending-events-content-placeholder">
                                                <Typography sx={{ margin: '5px 0px' }}>Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description</Typography>
                                                <div style={{ margin: '5px 0px' }}>Date: 01/01/2020</div>
                                                <div style={{ margin: '5px 0px' }}>Time: 4:20</div>
                                                <div style={{ margin: '5px 0px' }}>Location: 01/01/2020</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardWithBordersAndBgColor>
                            </Box> */}
                        </div>
                    })}
                </CustomSlider >
            </div >
            <div className="text-center" style={{ margin: '40px 0px' }}>
                <Link to='/all-collections'>
                    <TxtButton text="See All Collections" bgColor={'#04a5c3'} color="white" displayType="inline-block" borderColor={"#04a5c3"} />
                </Link>
            </div>
        </div >
    );

}