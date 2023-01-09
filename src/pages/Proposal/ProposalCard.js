import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { useSelector } from 'react-redux';
import CardWithTitle from "../../components/CardWithTitle";
import { BG_URL, PUBLIC_URL } from "../../utils/utils";
import { BITZIO_API } from "../../data/bitzio_api";
import { DownVoters, UpVoters } from "./Modals";
import { PROPOSAL_API_KEY } from "../../config";
import { useSearchParams } from "react-router-dom";

const ProposalCard = ({ proposal, NFTs }) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const transactionHashes = searchParams.get('transactionHashes')

    const userDetails = useSelector(state => state.userReducer)

    const [isOwner, setIsOwner] = useState(false)
    const [isVoted, setIsVoted] = useState(false)
    const [proposals, setProposals] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [test, setTest] = useState(undefined)
    const apiCall = useRef(undefined)
    const [apiLoading, setApiLoading] = useState(false)
    const [err, setErr] = useState(undefined)
    const [votingError, setVotingError] = useState(undefined)
    const [successMesssage, setSuccessMesssage] = useState(undefined)
    const [upModal, setUpModal] = useState(false)
    const [downModal, setDownModal] = useState(false)
    const isExpired = proposal.proposal.is_expired;

    console.log(proposal)
    const handleClose = () => {
        setUpModal(false)
        setDownModal(false)
    }
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined)
                apiCall.current.cancel();
        }
    }, [])
    const handleVote = async (isUpVote, proposalId) => {
        setApiLoading(true)
        try {
            const res = await userDetails.proposalContract.vote({
                args: {
                    proposal_id: proposalId,
                    voter: {
                        nft_owner_id: userDetails.userWallet,
                        is_upvote: isUpVote,
                        score: 1
                    },
                },
                accountId: userDetails.proposalContract.account.accountId,
                amount: "1"
            });
            console.log(res)
            // apiCall.current = BITZIO_API.request({
            //     path: `/proposal/cast-vote/${PROPOSAL_API_KEY}`,
            //     method: "post",
            //     body: {
            //         _id: proposalId,
            //         voter: {
            //             event_owner_wallet_address: userDetails.userWallet,
            //             is_upvote: isUpVote,
            //             score: 1
            //         }
            //     },
            // });
            // let response = await apiCall.current.promise;
            // console.log(response)
            // if (!response.isSuccess)
            //     throw response
            if (res) {
                setIsVoted(true)
                // setSuccessMesssage(response.message)
                setApiLoading(false)
            }
        }
        catch (err) {
            console.log(err)
            setVotingError("please try again later")
        }

    }

    useEffect(() => {
        if (proposal.proposal.voters !== null)
            for (var i = 0; i < proposal.proposal.voters.length; i++)
                if (proposal.proposal.voters[i].event_owner_wallet_address == userDetails.userWallet)
                    setIsVoted(true)
    }, [])

    useEffect(() => {
        for (var j = 0; j < NFTs.length; j++)
            if (NFTs[j].current_owner == userDetails.userWallet)
                setIsOwner(true)
    }, [])


    return (
        <div className="col-md-4">
            <div style={{ position: 'relative', margin: '40px 0px' }}>
                <div style={{ position: 'relative', margin: '40px 0px' }}>
                    <div style={{
                        backgroundColor: '#3a3d4d',
                        border: '2px solid #606370',
                        borderRadius: '70px',
                        height: '120px',
                        width: '120px',
                        position: 'absolute',
                        top: '-60px',
                        left: '50%',
                        transform: 'translate(-50%,0)',
                        zIndex: -1,
                        boxShadow: '0px 0px 10px 1px rgba(0,0,0,0.7)'
                    }}></div>
                    <div style={{ backgroundColor: '#3a3d4d', border: '2px solid #606370', borderRadius: 15, zIndex: 99, boxShadow: '0px 0px 15px 2px rgba(0,0,0,0.7)' }}>
                        <div className="row">
                            <div className="col-4" >
                            </div>
                            <div className="col-4">
                                <div style={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translate(-50%,0)',
                                    zIndex: 2,
                                    backgroundColor: '#3a3d4d',
                                    height: '118px',
                                    width: '118px',
                                    top: '-57px',
                                    borderRadius: '65px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        backgroundImage: BG_URL(PUBLIC_URL("images/proposal.png")),
                                        height: '100px',
                                        width: '100px',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        borderRadius: '50px',
                                    }} />
                                </div>
                            </div>
                            <div className="col-4">
                            </div>
                        </div>
                        <CardWithTitle title={`${proposal.proposal.title}`} width="90%" marginTop="80px" fontSize="16px" responsiveFontSize="12px">
                            <div className="row text-center">
                                <div className="col-12">
                                    {proposal.proposal.content}
                                </div>
                            </div>
                        </CardWithTitle>
                        {isExpired ?
                            <>
                                <Typography className="text-center" sx={{ color: "gray", fontSize: "11px" }}>this proposal is expired</Typography>
                            </>
                            :
                            <>
                                {isOwner ?
                                    <>
                                        {isVoted || transactionHashes ?
                                            <Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: "5px 0px" }}>
                                                    <Box className="text-center">
                                                        {proposal.proposal.upvotes !== null ?
                                                            <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setUpModal(true) }}>{proposal.proposal.upvotes}</div>
                                                            : <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setUpModal(true) }}>0</div>}
                                                        <div><ThumbUpOffAltOutlinedIcon sx={{ color: 'green', fontSize: '12px' }} /></div>
                                                    </Box>
                                                    <Box className="text-center">
                                                        {proposal.proposal.downvotes !== null ?
                                                            <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setDownModal(true) }}>{proposal.proposal.downvotes}</div>
                                                            : <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setDownModal(true) }}>0</div>}
                                                        <div><ThumbDownOffAltOutlinedIcon sx={{ color: 'red', fontSize: '12px' }} /></div>
                                                    </Box>
                                                </Box>
                                                <Typography className="text-center" sx={{ color: "gray", fontSize: "10px", marginBottom: "5px" }}>you voted for this proposal</Typography>
                                            </Box>
                                            :
                                            <>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: "10px 0px" }}>
                                                    <Box className="text-center">
                                                        {proposal.proposal.upvotes !== null ?
                                                            <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setUpModal(true) }}>{proposal.proposal.upvotes}</div>
                                                            : <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setUpModal(true) }}>0</div>}
                                                        <div><ThumbUpOffAltOutlinedIcon onClick={(e) => { handleVote(true, proposal.proposal_id) }} sx={{ color: 'green', fontSize: '24px', cursor: "pointer" }} /></div>
                                                    </Box>
                                                    <Box className="text-center">
                                                        {proposal.proposal.downvotes !== null ?
                                                            <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setDownModal(true) }}>{proposal.proposal.downvotes}</div>
                                                            : <div style={{ margin: '5px', fontSize: '12px', cursor: "pointer" }} onClick={() => { setDownModal(true) }}>0</div>}
                                                        <div><ThumbDownOffAltOutlinedIcon onClick={(e) => { handleVote(false, proposal.proposal_id) }} sx={{ color: 'red', fontSize: '24px', cursor: "pointer" }} /></div>
                                                    </Box>
                                                </Box>
                                                {votingError ? <Typography className="text-center" sx={{ color: "red", fontSize: "10px" }}>{votingError}</Typography> : undefined}
                                            </>
                                        }
                                    </> :
                                    <>
                                        <Typography className="text-center" sx={{ color: "gray", fontSize: "11px", margin: "5px" }}>you must be an nft owner of the collection to participate in the proposal</Typography>
                                    </>
                                }
                            </>
                        }
                    </div>
                </div>
            </div >
            <Box>
                <UpVoters open={upModal} onClose={handleClose} voters={proposal.proposal.voters} />
                <DownVoters open={downModal} onClose={handleClose} voters={proposal.proposal.voters} />
            </Box>
        </div>);
}

export default ProposalCard;