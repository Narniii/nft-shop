import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { CanvasJSChart } from 'canvasjs-react-charts'
import { utils } from "near-api-js";
import { Link } from "react-router-dom";
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const NftHistory = ({ listings }) => {
    const theme = useTheme()
    const [chartData, setChartData] = useState(undefined)

    useEffect(() => {
        const options = {
            // theme: "dark2",
            responsive: true,
            backgroundColor: "#3a3d4d",
            animationEnabled: true,
            width: '400',
            title: {
                backgroundColor: "inherit",
                text: "price history",
                fontColor: "#606370"
            },
            axisX: {
                gridThickness: 0,
                lineThickness: 1,
                // lineColor:"white",
                tickThickness: 1,
                tickLength: 2,
                tickColor: "white",
                interval: [],
                title: "sold at",
                titleFontColor: "#606370",
                labelFontColor: "white"
            },
            axisY: {
                gridThickness: 0,
                lineThickness: 1,
                // lineColor:"white",
                tickLength: 1,
                tickColor: "white",
                title: "price",
                prefix: "N",
                titleFontColor: "#606370",
                labelFontColor: "white"

            },
            data: [{
                // yValueFormatString: "$#,###",
                // xValueFormatString: "MMMM",
                type: "splineArea",
                color: 'rgba(27, 127, 153, 0.6)',
                dataPoints: [
                ]
            }],

        }

        // for (let i = 0; i < nft.price_history.length; i++) {
        //     options.data[0].dataPoints.push({ x: nft.price_history[i].sold_at, y: nft.price_history[i].price })
        //     options.axisX.interval.push = nft.price_history[i].sold_at
        // }
        setChartData(options)
    }, [])
    return (
        <Box sx={{ height: "400px", width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", }, }}>
            {/* {chartData != undefined ? */}
            <>
                {/* <canvas id="myChart" width="400" height="400"> */}
                {/* <Line data={chartData} legend={chartLegend} /> */}
                {/* </canvas> */}
                {/* <Box> */}
                {/* <CanvasJSChart options={chartData} /> */}
                {/* </Box> */}

                {listings != undefined ?
                    <>
                        {listings.length > 0 ?
                            <>
                                {listings.map((listing, index) => {
                                    return <Box sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "30px", minHeight: '80px' }}>
                                        {listing.event == "nft_mint" ?
                                            <>
                                                <Link to={`/creator/${listing.from}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{listing.from}</Link>
                                                <Typography sx={{ display: 'inline-block' }}>&nbsp;minted for {listing.price} Ⓝ</Typography>
                                            </>
                                            : undefined}
                                        {listing.event == "nft_list" ?
                                            <>
                                                <Link to={`/creator/${listing.from}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{listing.from}</Link>
                                                <Typography sx={{ display: 'inline-block' }}>&nbsp;listed for {listing.price} Ⓝ</Typography>
                                            </>
                                            : undefined}
                                        {listing.event == "nft_transfer" ?
                                            <>
                                                <Link to={`/creator/${listing.from}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{listing.from}</Link>
                                                <Typography sx={{ display: 'inline-block' }}>&nbsp;sold for {listing.price} Ⓝ to &nbsp;</Typography>
                                                <Link to={`/creator/${listing.to}`} style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>{listing.to}</Link>
                                            </>
                                            : undefined}
                                    </Box>
                                })}
                            </>
                            :
                            <Box sx={{ borderRadius: "15px", height: "80px", margin: "10px 20px", backgroundColor: "#606370", padding: "30px" }}>
                                <div className="h-100 d-flex justify-content-center align-items-center text-light">no history to show</div>
                            </Box>
                        }</>
                    :
                    <>
                        <Box sx={{ borderRadius: "15px", height: "80px", margin: "10px 20px", backgroundColor: "#606370", padding: "10px" }}>
                            <div className="h-100 d-flex justify-content-center align-items-center text-light">
                                <CircularProgress />
                            </div>
                        </Box>
                    </>
                }
            </>
            {/* :
            <>
                <Box sx={{ borderRadius: "15px", height: "80px", margin: "10px 20px", backgroundColor: "#606370", padding: "10px" }}>
                    <div className="h-100 d-flex justify-content-center align-items-center text-light">
                        <CircularProgress />
                    </div>
                </Box>
            </>
            } */}
        </Box >
    );
}

export default NftHistory;