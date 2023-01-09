import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const InfoTab = ({ collection, nft }) => {
    const userDetails = useSelector(state => state.userReducer)
    const theme = useTheme()
    const [royalty, setRoyalty] = useState(undefined)
    const [smartContract, setSmartContract] = useState(undefined)
    useEffect(() => {
        let royaltyPercentage = 0
        for (const item of Object.entries(nft.perpetual_royalties)) {
            royaltyPercentage += item[1].royalty
        }
        setRoyalty(royaltyPercentage)
    }, [])
    useEffect(() => {
        if (userDetails && userDetails.nftContract)
            setSmartContract(userDetails.nftContract.contractId)
    }, [userDetails])
    return (
        <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' }, overflowY: "scroll", '&::-webkit-scrollbar': { display: "none", }, padding: "0 20px" }}>
            <Box sx={{ borderRadius: "15px", height: "auto", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                <h6 className="font-weight-bold">Description:</h6>
                <p>{nft.description}</p>
                <p>{nft.short_description}</p>
            </Box>

            <Box sx={{ borderRadius: "15px", height: "auto", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                <h6>Collection:</h6>
                <p>{collection.collection_title}</p>
            </Box>
            {nft.extra.length != 0 ?
                <Box sx={{ borderRadius: "15px", height: "auto", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                    <Typography variant="h6">Properties:</Typography>
                    <Box className="row">
                        {nft.extra.map((property, index) => {
                            return <Box key={index} className="col-6">
                                <Box sx={{ border: `1px solid ${theme.pallete.lightBlue}`, backgroundColor: "#3a3d4d", margin: 1, borderRadius: '5px' }}>
                                    <Link to={`/search-by-properties?property=${property.name}`}>
                                        <Typography variant="h6" sx={{ textAlign: 'center', color: theme.pallete.lightBlue }}>{property.name}</Typography>
                                        <Typography variant="h6" sx={{ textAlign: 'center', color: "white" }}>{property.value}</Typography>
                                    </Link>
                                </Box>
                            </Box>
                        })}
                    </Box>
                </Box>
                : undefined
            }
            <Box sx={{ borderRadius: "15px", height: "auto", margin: "3px 0", display: "flex", width: "100%" }}>
                <Box sx={{ borderRadius: "15px", height: "auto", marginRight: "5px", backgroundColor: "#606370", padding: "10px", flex: 1 }}>
                    <h6>royalty</h6>
                    <p>{royalty}%</p>
                </Box>
                <Box sx={{ borderRadius: "15px", height: "auto", marginRight: "5px", backgroundColor: "#606370", padding: "10px", flex: 1 }}>
                    <h6>copies</h6>
                    <p>{nft.copies}</p>
                </Box>
                <Box sx={{ borderRadius: "15px", height: "auto", backgroundColor: "#606370", padding: "10px", flex: 1 }}>
                    <h6>views</h6>
                    <p>{nft.views}</p>
                </Box>
            </Box>
            <Box sx={{ borderRadius: "15px", height: "auto", margin: "3px 0", backgroundColor: "#606370", padding: "10px" }}>
                <Typography variant="h6">Token info:</Typography>
                <Box>
                    <Typography variant="h6" sx={{ display: 'inline-block' }}>Smart contract:</Typography>
                    <Typography variant="h6" sx={{ display: 'inline-block', color: "white" }}>&nbsp;{smartContract}</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ display: 'inline-block' }}>locked fee:</Typography>
                    <Typography variant="h6" sx={{ display: 'inline-block', color: "white" }}> &nbsp;2%</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ display: 'inline-block' }}>Image link:</Typography>
                    <a href={nft.media} target="_blank" style={{ display: 'inline-block', color: theme.pallete.lightBlue }}>
                        &nbsp;{nft.media.substring(0, 20) + "..."}
                    </a>
                </Box>
                {
                    nft.current_owner ?
                        <Box>
                            <Typography variant="h6" sx={{ display: 'inline-block' }}>Owner:</Typography>
                            <Link to={`/creator/${nft.current_owner}`}>
                                <Typography variant="h6" sx={{ display: 'inline-block', color: theme.pallete.lightBlue }}>&nbsp;{nft.current_owner}</Typography>
                            </Link>
                        </Box>
                        :
                        undefined
                }
            </Box>
        </Box >
    );
}

export default InfoTab;