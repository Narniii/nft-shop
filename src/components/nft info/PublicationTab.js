import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const PublicationTab = ({nft}) => {
    return (
        <Box sx={{ margin: '0 auto', height: "400px", width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", },padding:"0 20px" }}>
            {nft.offers != undefined ?
                <>
                    {nft.owners.map((owner, index) => {
                        return <Box sx={{ borderRadius: "15px", height: "80px", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                            <div className="d-flex flex-row justify-content-start align-items-center">
                                <Box sx={{ borderRadius: "50%", overflow: "hidden", border: "1px solid white", width: "30px", height: "30px" }}></Box>
                                <Link style={{ textDecoration: "none", color: "whitesmoke", verticalAlign: "center", "&:hover": { textDecoration: "underline" } }} to='/'><h6 style={{ margin: 0 }}>{owner.user}</h6></Link>
                            </div>
                        </Box>
                    })}
                </>
                :
                <>
                    <Box sx={{ borderRadius: "15px", height: "80px", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                        <div className="h-100 d-flex justify-content-center align-items-center text-light">No offer at the moment</div>
                    </Box>
                </>
            }
        </Box>
    );
}

export default PublicationTab;