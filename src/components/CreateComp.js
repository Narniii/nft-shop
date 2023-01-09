import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import { BG_URL, PUBLIC_URL } from "../utils/utils";
import CardWithBordersAndBgColor from "./CardWithBordersAndBgColor";
import CustomTitle from "./CustomTitle";

const Create = () => {
    return (
        <div className="container">
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", minHeight: "80vh", padding: "5vh 0vh" }}>
                <CustomTitle text="What do you want to create?" variant="h4" fontWeight="bold" isCenter={true} margin="0px 0px" />
                <Box
                    className="row"
                //  sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center", width: "100%" }}
                >
                    <div className='col-md-4'>
                        <Link to={'nft'} style={{ textDecoration: "none", color: "whitesmoke" }}>
                            <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                <div style={{
                                    backgroundImage: BG_URL('/images/cat1.jpg'),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '140px',
                                    borderRadius: '10px',
                                }}>
                                </div>
                                <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>NFT</div>
                            </CardWithBordersAndBgColor>
                        </Link>
                    </div>
                    <div className='col-md-4'>
                        <Link to={'collection'} style={{ textDecoration: "none", color: "whitesmoke" }}>
                            <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                <div style={{
                                    backgroundImage: BG_URL('/images/cat2.jpg'),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '140px',
                                    borderRadius: '10px',
                                }}>
                                </div>
                                <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>collection</div>
                            </CardWithBordersAndBgColor>
                        </Link>
                    </div>
                    <div className='col-md-4'>
                        <Link to={'event'} style={{ textDecoration: "none", color: "whitesmoke" }}>
                            <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                <div style={{
                                    backgroundImage: BG_URL('/images/cat3.jpg'),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '140px',
                                    borderRadius: '10px',
                                }}>
                                </div>
                                <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>event</div>
                            </CardWithBordersAndBgColor>
                        </Link>
                    </div>
                    <div className='col-md-4'>
                        <Link to={'shop'} style={{ textDecoration: "none", color: "whitesmoke" }}>
                            <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                <div style={{
                                    backgroundImage: BG_URL('/images/cat5.jpg'),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '140px',
                                    borderRadius: '10px',
                                }}>
                                </div>
                                <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>shop</div>
                            </CardWithBordersAndBgColor>
                        </Link>
                    </div>
                    <div className='col-md-4'>
                        <Link to={'proposal'} style={{ textDecoration: "none", color: "whitesmoke" }}>
                            <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                <div style={{
                                    backgroundImage: BG_URL('/images/cat6.jpg'),
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '140px',
                                    borderRadius: '10px',
                                }}>
                                </div>
                                <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>proposal</div>
                            </CardWithBordersAndBgColor>
                        </Link>
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default Create;