import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Categories from './Categories'
import HomeSlider from './HomeSlider'
import Intro from './Intro'
import LiveAuctions from './LiveAuctions'
import MintingCalendar from './MintingCalendar'
import Rankings from './Rankings'
import TopSales from './TopSales'
import TrendingEvents from './TrendingEvents'
import TrendingShops from './TrendingShops'

export default function Home() {
    const userDetails = useSelector(state => state.userReducer)
    // console.log(userDetails)
    return (
        <>
            <Intro />
            <MintingCalendar />
            <LiveAuctions />
            <HomeSlider />
            <Rankings />
            {/* <TrendingShops /> */}
            {/* <TopSales /> */}
            {/* <TrendingEvents /> */}
            <Categories />
        </>
    )
}
