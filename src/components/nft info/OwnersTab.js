import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const OwnersTab = ({ nft }) => {
    const theme = useTheme()
    return (
        <Box sx={{ margin: '0 auto', height: "400px", width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", }, padding: "0 20px" }}>
            {nft.owners.length == 0 ?
                <Box className="text-center" sx={{ borderRadius: "15px", margin: "10px 20px", backgroundColor: "#606370", padding: "25px", minHeight: '80px', position: "relative" }}>
                    <Typography className="text-center">this nft has no owner</Typography>
                </Box>
                :
                nft.owners.map((owner, index) => {
                    return <Box className="text-center" key={index} sx={{ borderRadius: "15px", height: "80px", margin: "10px 20px", backgroundColor: "#606370", padding: "30px" }}>
                        <div className="d-flex flex-row justify-content-start align-items-center text-center">
                            {/* <Box sx={{ borderRadius: "50%", overflow: "hidden", border: "1px solid white", width: "30px", height: "30px" }}></Box> */}
                            <Link style={{ textDecoration: "none", color: '#bbffff', verticalAlign: "center", "&:hover": { textDecoration: "underline" } }} className="text-center" to='/'><h6 style={{ margin: 0 }}>{owner.owner_wallet_address}</h6></Link>
                        </div>
                    </Box>
                })}
        </Box>

    );
}

export default OwnersTab;