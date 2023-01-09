import { Box, CircularProgress, Paper, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import LoadingComponent from '../../components/loading/LoadingComponent'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import TxtButton from '../../components/TxtButton'
import { COLLECTION_API } from '../../data/collection_api'
export default function Market() {
    const theme = useTheme()
    const navigate = useNavigate()
    const [firstLoadErr, setFirstLoadErr] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const userDetails = useSelector(state => state.userReducer)
    const [fromIndex, setFromIndex] = useState(0)
    const [toIndex, setToIndex] = useState(3)
    const [apiLoading, setApiLoading] = useState(false)
    const [nfts, setNfts] = useState([])
    const [showLoadMore, setShowLoadMore] = useState(true)
    const apiCall = useRef(undefined)
    useEffect(() => {
        if (userDetails.marketContract && userDetails.nftContract)
            fetchData()
    }, [userDetails])
    const fetchData = async () => {
        setApiLoading(true)
        try {
            const res = await userDetails.marketContract.get_sales_by_nft_contract_id({
                nft_contract_id: userDetails.nftContract.contractId,
                from_index: fromIndex.toString(),
                limit: toIndex.toString(),
            });
            if (res.indexOf('Error') !== -1)
                throw res
            let _nfts = [...nfts]
            if (res.length != 0)
                for (var i = 0; i < res.length; i++) {
                    try {
                        let response = await userDetails.nftContract.nft_token({
                            token_id: res[i].token_id
                        });
                        if (res.indexOf('Error') !== -1)
                            throw res
                        _nfts.push(response)
                    }
                    catch (err) {
                        if (nfts.length == 0) setFirstLoadErr("Failed to load NFTs")
                        else setErr("Failed to load NFTs")
                        setApiLoading(false)
                        setLoading(false)
                        return
                    }

                }
            else setShowLoadMore(false)
            setApiLoading(false)
            setLoading(false)
            setFromIndex(fromIndex + 3)
            setToIndex(toIndex + 3)
            setNfts(_nfts)
            setErr(undefined)
        } catch (error) {
            if (nfts.length == 0) setFirstLoadErr("Failed to load NFTs")
            else setErr("Failed to load NFTs")
            setApiLoading(false)
            setLoading(false)
        }
    }
    const getNFT = async (id) => {
        try {
            apiCall.current = COLLECTION_API.request({
                path: `/cmd/nft/get/`,
                method: "post",
                body: { nft_id: id },
            });
            let response = await apiCall.current.promise;
            if (!response.isSuccess)
                throw response
            navigate(`/collections/${response.data[0].collection_title}/assets/${response.data[1]._id.$oid}`)
        }

        catch (err) {
        }
    }
    return (
        <Box className="container">
            {loading ?
                <Box sx={{ padding: '20px 0px' }}>
                    <LoadingComponent
                        isGrid={true}
                        ColNumber={3}
                        responsiveColNumber={1}
                        elementType={"rounded"}
                        elementWidth={"100%"}
                        elementHeight="300px"
                        responsiveElementWidth="100%"
                        responsiveElementHeight="300px"
                        elementCount={3}
                        responsiveCount={1}
                    />
                </Box>
                :
                firstLoadErr ?
                    <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ color: 'red' }}>{firstLoadErr}</Typography>
                    </Box>
                    :
                    nfts.length === 0 ?
                        <Box sx={{ minHeight: "40vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography sx={{ color: theme.pallete.lightBlue }}>No NFTs found</Typography>
                        </Box>
                        :
                        <Box sx={{ padding: '20px 0px' }}>
                            <div className='row'>
                                {console.log(nfts)}
                                {nfts.map((nft, index) => {
                                    return <div className='col-md-4' key={index}>
                                        <Paper elevation={5} sx={{ margin: 2, height: "400px", borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
                                            <Box sx={{
                                                backgroundImage: BG_URL(PUBLIC_URL(nft.metadata.media)),
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                width: '100%',
                                                height: 150,
                                                borderTopRightRadius: 5,
                                                borderTopLeftRadius: 5,
                                            }}>
                                            </Box>
                                            <Typography sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '30px', color: 'black' }}>{nft.title}</Typography>
                                            <Typography sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '5px', marginBottom: '10px', fontSize: '12px', color: 'black' }}>Owner <Link style={{ color: theme.pallete.lightBlue }} to={`/creator/${nft.owner_id}`}>{nft.owner_id}</Link></Typography>
                                            <Box sx={{ width: '90%', height: '125px', margin: '0 auto' }}>
                                                <Typography sx={{ color: 'rgb(112, 122, 131)', display: 'flex', flexWrap: 'wrap', height: '100%' }}>
                                                    {nft.metadata.description.length > 150 ? nft.metadata.description.substring(0, 150) + "..." : nft.metadata.description}
                                                </Typography>
                                            </Box>
                                            <TxtButton
                                                text="View Item"
                                                bgColor="#04a5c3"
                                                borderColor="rgba(27, 127, 153, 1)"
                                                width='160px'
                                                margin="0 auto"
                                                color="white"
                                                onClick={() => getNFT(nft.token_id)}
                                            />
                                        </Paper >
                                    </div>
                                })}
                            </div>
                            {!showLoadMore ?
                                undefined
                                :
                                <Box sx={{ margin: '20px auto', width: 'fit-content' }}>
                                    {err ?
                                        <Box sx={{ minHeight: "2vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Typography sx={{ color: 'red' }}>{err}</Typography>
                                        </Box>
                                        :
                                        undefined
                                    }
                                    {apiLoading ?
                                        <TxtButton
                                            text={<CircularProgress size={20} sx={{ fontSize: '5px' }} />}
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            width='160px' />
                                        :
                                        <TxtButton
                                            text="Load more"
                                            bgColor="linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)"
                                            borderColor="rgba(27, 127, 153, 1)"
                                            fontSize="14px"
                                            onClick={fetchData}
                                            width="100%"
                                            displayType="inline-block"
                                        />
                                    }

                                </Box>
                            }
                        </Box>
            }
        </Box >
    )
}
