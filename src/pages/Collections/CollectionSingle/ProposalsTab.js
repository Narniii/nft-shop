import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CardWithBordersAndBgColor from "../../../components/CardWithBordersAndBgColor";
import CardWithTitle from "../../../components/CardWithTitle";
import TxtButton from "../../../components/TxtButton";
import { BG_URL, PUBLIC_URL } from "../../../utils/utils";
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { BITZIO_API } from "../../../data/bitzio_api";
import { DownVoters, UpVoters } from "../../Proposal/Modals";
import { useSelector } from 'react-redux';
import ProposalCard from "../../Proposal/ProposalCard";
import { PROPOSAL_API_KEY } from "../../../config";
import { useParams } from "react-router-dom";

const Proposals = ({ collection, NFTs }) => {
    const theme = useTheme()
    const id = useParams()
    console.log(NFTs)
    const userDetails = useSelector(state => state.userReducer)
    const [proposals, setProposals] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const apiCall = useRef(undefined)
    const [err, setErr] = useState(undefined)


    useEffect(() => {
        // getNFTs()
        getProposals()
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
            // if (nftsApiCall.current !== undefined)
            //   nftsApiCall.current.cancel();
        }
    }, [])

    const getProposals = async () => {
        try {
            const res = await userDetails.proposalContract.get_all_proposals_by_collection({
                "collection_name": collection.title,
            });
            console.log(res)
            setProposals(res)

            // apiCall.current = BITZIO_API.request({
            //     path: `/proposal/get/collection`,
            //     method: "post",
            //     body: {
            //         _id: id.id
            //     }
            // });
            // let response = await apiCall.current.promise;
            // console.log(response)
            // if (!response.isSuccess)
            //     throw response
            // setProposals(response.data.events)
        }
        catch (err) {
            if (err.status == 404) {
                setProposals([])
                setErr(undefined)
            } else {
                console.log(err)
                setErr("we're sorry . something is wrong with the server , will be fixed asap")
            }
        }
    }

    useEffect(() => {
        if (proposals)
            setLoading(false)
    }, [proposals])



    return (
        <Box sx={{ margin: '0 auto', width: { md: '100%', lg: '90%' } }}>
            {loading ? <Box className='text-center' sx={{ paddingTop: '30px' }} ><CircularProgress /> </Box> :
                <>
                    {proposals.length != 0 ?
                        <div className='row' style={{ margin: "40px 0px" }}>
                            {console.log(proposals)}
                            {
                                proposals.map((proposal, index) => {
                                    return <ProposalCard NFTs={NFTs} proposal={proposal} key={index} />
                                })
                            }
                        </div>
                        : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '30vh' }}>
                            <Typography variant='h4' sx={{ textAlign: 'center', color: theme.pallete.lightBlue }}>No proposals found</Typography>
                        </Box>
                    }
                </>
            }
        </Box>
    );
}

export default Proposals;