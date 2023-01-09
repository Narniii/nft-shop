// import { makeStyles } from '@material-ui/styles';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './NFTSingle.css'
import { BG_URL, PUBLIC_URL } from '../../utils/utils';
import TimelineIcon from '@mui/icons-material/Timeline';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DetailsOutlinedIcon from '@mui/icons-material/DetailsOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PeopleIcon from '@mui/icons-material/People';
import BorderAllOutlinedIcon from '@mui/icons-material/BorderAllOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ColumnGroupingTable from '../../components/Table';


export default function NFTSingle() {
    const collection = {
        title: "Fishuman",
        creator: "erfan.near",
        nfts: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},]
    }
    const nft = {
        title: "beautiful fish",
        price_history: [{owner_id:'narin.near',sold_at:new Date(),price:999.9}, {owner_id:'narin.near',sold_at:new Date(),price:23.3}, {owner_id:'narin.near',sold_at:new Date(),price:54}, {owner_id:'narin.near',sold_at:new Date(),price:765}],
        id: 33,
        current_owner: 'narin.near',
        updated_at: new Date(),
        owners: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }, { id: "7" }, { id: "8" }, { id: "9" }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }, { id: 16 },],
        views: 7778,
        favorites: 817
    }
    return (
        <section>
            <div className='continer'>
                <div className='container'>
                    <div className='nft-content'>
                        <div className='sections image-and-content'>
                            <div className='image-and-details' style={{ width: "44%" }}>
                                <div className='nft-image'>
                                    <div style={{ height: "50px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
                                        <Link to='/'>
                                            <div>Buy now</div>
                                        </Link>
                                        <div>
                                            <FavoriteBorderOutlinedIcon fontSize='large' />
                                            {nft.favorites}
                                        </div>
                                    </div>
                                    <div style={{ width: "100%", height: "550px", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundImage: BG_URL(PUBLIC_URL('images/bg.avif')) }} />
                                </div>
                                <div className='nft-description'>
                                    <div className='description-title'>
                                        <div className='d-flex flex-row justify-content-start align-items-center' style={{ padding: "5%" }}>
                                            <DescriptionOutlinedIcon fontSize='large' />
                                            <div>
                                                description
                                            </div>
                                        </div>
                                    </div>
                                    <div className='description-content'></div>
                                    <Accordion sx={{ backgroundColor: "#3a3d4d !important", borderRadius: "0px !important" }}>
                                        <AccordionSummary
                                            sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                            expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className='d-flex flex-row justify-content-start align-items-center' >
                                                <InfoOutlinedIcon fontSize='large' />
                                                <div>
                                                    about {collection.title}
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                            <div style={{ height: "200px" }}>details</div>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion sx={{ backgroundColor: "#3a3d4d !important", borderRadius: "0px !important", borderBottomLeftRadius: "15px !important", borderBottomRightRadius: "15px !important" }}>
                                        <AccordionSummary
                                            sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                            expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <div className='d-flex flex-row justify-content-start align-items-center' >
                                                <DetailsOutlinedIcon fontSize='large' />
                                                <div>
                                                    Details
                                                </div>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                            <div style={{ height: "200px" }}>details</div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            <div className='image-and-details' style={{ width: "55%" }}>
                                <div className='top-content' style={{ border: "#131318 solid 1px", borderRadius: "15px", height: "150px", overflow: "hidden" }}>
                                    <div className='w-100 p-2 d-flex flex-row justify-content-between align-items-center '>
                                        <Link to='/'>
                                            <h5 >{collection.title}</h5>
                                        </Link>
                                    </div>
                                    <div className='w-100 p-2' >
                                        <h2>
                                            {nft.title}
                                        </h2>
                                    </div>
                                    <div className='w-100 p-2 d-flex flex-row justify-content-between align-items-center' >
                                        <div>
                                            <PeopleIcon />
                                            {nft.owners.length}
                                        </div>
                                        <div>
                                            <BorderAllOutlinedIcon />
                                            {collection.nfts.length}
                                        </div>
                                        <div>
                                            <RemoveRedEyeOutlinedIcon />
                                            {nft.views}
                                        </div>
                                        <div>
                                            <FavoriteBorderOutlinedIcon />
                                            {nft.favorites}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ border: "1px solid #131318", borderRadius: "15px", overflow: "hidden" }}>
                                    <div className='description-title'>
                                        <div className='d-flex flex-row justify-content-start align-items-center' style={{ padding: "5%" }}>
                                            <AccessTimeOutlinedIcon fontSize='large' />
                                            <div>
                                                Sale ends July 14, 2022 at 3:02pm GMT+4:30
                                            </div>
                                        </div>
                                    </div>
                                    <div className='description-content'></div>
                                </div>
                                <Accordion sx={{ backgroundColor: "#3a3d4d !important", borderRadius: "15px !important", border: "1px solid #131318 !important" }}>
                                    <AccordionSummary
                                        sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                        expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <div className='d-flex flex-row justify-content-around align-items-center' style={{ width: "25%" }}>
                                            <TimelineIcon fontSize='large' />
                                            <div>
                                                Price History
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                        <div style={{ height: "200px" }}>
                                            {nft.price_history.map((his,index)=>{return <div key={index}>{his.price}</div>})}
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion sx={{ backgroundColor: "#3a3d4d !important", borderRadius: "15px !important", border: "1px solid #131318 !important" }}>
                                    <AccordionSummary
                                        sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                        expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <div className='d-flex flex-row justify-content-around align-items-center' style={{ width: "25%" }}>
                                            <LocalOfferOutlinedIcon fontSize='large' />
                                            <div>
                                                Listings
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                        <div style={{ height: "200px" }}>details</div>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion sx={{ backgroundColor: "#3a3d4d !important", borderRadius: "15px !important", border: "1px solid #131318 !important" }}>
                                    <AccordionSummary
                                        sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                        expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <div className='d-flex flex-row justify-content-around align-items-center' style={{ width: "25%" }}>
                                            <FormatListBulletedOutlinedIcon fontSize='large' />
                                            <div>
                                                Offers
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                        <div style={{ height: "200px" }}>details</div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                        <div className='sections item-activity'>
                            <Accordion>
                                <AccordionSummary
                                    sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                    expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div className='d-flex flex-row justify-content-around align-items-center' >
                                        <OpenInFullIcon fontSize='large' />
                                        <div style={{ textTransform: "capitalize" }}>
                                            item activity
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }}>
                                    {/* <div style={{ height: "200px" }}> */}
                                        <ColumnGroupingTable/>
                                    {/* </div> */}
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='sections see-more'>
                            <Accordion>
                                <AccordionSummary
                                    sx={{ border: "none !important", borderRadius: "0 !important", height: "80px" }}
                                    expandIcon={<ExpandMoreIcon color="white" sx={{ fontSize: 20, color: "white" }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <div className='d-flex flex-row justify-content-around align-items-center' >
                                        <MoreVertOutlinedIcon fontSize='large' />
                                        <div style={{ textTransform: "capitalize" }}>
                                            more from this collection
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderTop: "1px solid #131318 !important" }} >
                                    <div className='more-assets'>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                        <div className='more-asset'>this is an asset</div>
                                    </div>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "80px" }}>
                                        <button className='view-collection-button'>view collection</button>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
