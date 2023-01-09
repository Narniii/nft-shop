import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, IconButton, SwipeableDrawer, Tooltip, Typography, useTheme } from '@mui/material'
import { BG_URL, PUBLIC_URL } from '../utils/utils'
import './Navbar.css'
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import Zoom from '@mui/material/Zoom';
import { connect, WalletConnection, utils } from 'near-api-js';
import { API_CONFIG, getConfig } from '../config';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../redux/actions';
import { AUTH_API } from '../data/auth_api';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StoreIcon from '@mui/icons-material/Store';
const { format: { formatNearAmount } } = utils;

export default function Navbar() {
    const theme = useTheme()
    const location = useLocation();
    const dispatch = useDispatch();
    const apiCall = useRef(undefined)
    const [create, setCreate] = useState(false)
    const [shop, setShop] = useState(false)
    const [market, setMarket] = useState(false)
    const [balance, setBalance] = useState(0)
    const [user, setUser] = useState(undefined)
    const [state, setState] = React.useState({
        right: false,
    });
    const userDetails = useSelector(state => state.userReducer)
    const navigate = useNavigate();
    const [query, setQuery] = useState("")
    const onChange = (e) => {
        setQuery(e.target.value)
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (query.length != 0)
                navigate(`/search?query=${query}`)
        }
    }
    // const balance = userDetails.account.getAccountDetails();
    const handleLogin = () => {
        userDetails.wallet.requestSignIn({
            contractId: 'market.bitzio.testnet',
            methodNames: [
                'nft_metadata',
                'nft_token',
                'nft_tokens_for_owner',
                'nft_tokens',
                'nft_supply_for_owner',
                'nft_payout',
                'nft_transfer_payout',
                'nft_events',
                'new_default_meta',
                'nft_mint',
                'nft_transfer',
                'nft_transfer_call',
                'nft_revoke',
                'nft_revoke_all',
                'nft_approve',
                'get_supply_sales',
                'get_supply_by_owner_id',
                'get_supply_by_nft_contract_id',
                'get_sale',
                'get_sales_by_owner_id',
                'get_sales_by_nft_contract_id',
                'storage_balance_of',
                'storage_minimum_balance',
                'storage_deposit',
                'storage_withdraw',
                'remove_sale',
                'update_price',
                'offer',
            ],
        });
    };
    const handleLogOut = async () => {
        dispatch(logOutUser());
        userDetails.wallet.signOut();
    }
    useEffect(() => {
        if (userDetails && userDetails.wallet) {
            userDetails.wallet.account().getAccountBalance().then(({ available }) => setBalance(available));
            if (userDetails.isLoggedIn == true && user == undefined) getUser()
        }
    }, [userDetails])
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    useEffect(() => {
        if (window.location.href.indexOf('/search') === -1) {
            setQuery("")
        }
        if (window.location.href.indexOf('/create') !== -1) {
            setCreate(true)
            setShop(false)
            setMarket(false)
            // setResources(false)

        }
        else if (window.location.href.indexOf('/merchendise-shop') !== -1) {
            setCreate(false)
            setShop(true)
            setMarket(false)
            // setResources(false)
        }
        else if (window.location.href.indexOf('/market') !== -1) {
            setCreate(false)
            setShop(false)
            setMarket(true)
            // setResources(false)
        }
        else if (window.location.href.indexOf('/resources') !== -1) {
            setCreate(false)
            setShop(false)
            setMarket(false)
            // setResources(true)
        }
        else {
            setCreate(false)
            setShop(false)
            setMarket(false)
            // setResources(false)
        }
    }, [location])
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])
    const getUser = async () => {
        try {
            apiCall.current = AUTH_API.request({
                path: `/auth/user/get/`,
                method: "post",
                body: {
                    wallet_address: userDetails.userWallet,
                    id: ""
                },
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess)
                throw response
            setUser(response.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    const NavMobileRow = ({ link, logo, text, isSelected }) => {
        return <Link to={link}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                background: isSelected ? 'linear-gradient(180deg, rgba(27, 127, 153, 1) 0%, rgba(27, 127, 153, 0) 100%)' : '#42475a',
                margin: '4px 0px',
                padding: '10px 20px',
                alignItems: 'center',
                borderBottom: isSelected ? "1px solid #1d7c96 " : 'inherit'
            }}>
                <div>{logo}</div>
                <div>
                    <Typography variant="h6" sx={{ color: 'white', marginTop: '8px', fontWeight: 'bold', marginLeft: '10px' }}>{text}</Typography>
                </div>
            </div>
        </Link>
    }
    const NavAccardeon = ({ title, logo, children }) => {
        return <Accordion sx={{ background: '#42475a', margin: '2px 0px' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '30px' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {logo}
                    <Typography variant='h6' sx={{ fontWeight: 'bold', margin: '0px 10px', textDecoration: 'none', color: 'white' }}>{title}</Typography>
                </Box>
            </AccordionSummary>
            {children}
        </Accordion>
    }
    return (
        <>
            <Box className='nav-wrapper' sx={{
                background: '#3a3d4d', width: '100%', height: '75px', boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.7)', position: 'sticky', top: 0, zIndex: 99
            }}>
                <Box sx={{
                    display: {
                        xs: 'none', sm: 'none', md: 'block'
                    },
                }} className='container-fluid'>
                    <Box sx={{ display: 'flex' }}>
                        <Link to={'/'} style={{ flex: 1, flexDirection: "row", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                backgroundImage: BG_URL(PUBLIC_URL(`/images/logo.svg`)),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '65px',
                                height: '65px',
                                display: 'inline-block'
                            }} />
                            <Typography variant='h4' sx={{ fontWeight: 'bold', display: 'inline-block', margin: '0px 10px', textDecoration: 'none', color: 'white' }}>aqua</Typography>
                        </Link>

                        <Box sx={{ flex: { md: 2, lg: 3 }, flexDirection: "row" }}>
                            <div style={{ margin: '0 auto', position: 'relative', width: '70%' }}>
                                <input type="text" value={query} className="form-control" placeholder="Search" onChange={onChange} onKeyDown={handleKeyDown} />
                                <SearchIcon sx={{ cursor: "pointer" }} className="nav-search-icon" onClick={() => navigate(`/search?query=${query}`)} />
                            </div>
                        </Box>

                        <Box className='nav-tabs-container' sx={{ flex: { md: 6, lg: 4 }, flexDirection: 'row', display: 'flex' }} >
                            {create ?
                                <Link to="/create/collection" className="nav-tab borders active" style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <Typography sx={{ fontWeight: 'bold', display: 'inline-block', fontSize: "16px" }}>Create</Typography>
                                    <AddCircleOutlineOutlinedIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                                :
                                <Link to="/create/collection" className="nav-tab borders " style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <Typography sx={{ fontWeight: 'bold', display: 'inline-block', fontSize: "16px" }}>Create</Typography>
                                    <AddCircleOutlineOutlinedIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                            }

                            {shop ?
                                <Link to="/merchendise-shop" className="nav-tab borders active" style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <div
                                        // style={{ flex: 4, padding: '0px 0px 0px 2px' }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }}>Merchendise Shop</Typography>
                                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: "9px", color: 'orange' }}>105 Collections</Typography> */}
                                    </div>
                                    <ExploreOutlinedIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                                :
                                <Link to="/merchendise-shop" className="nav-tab borders" style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <div
                                        // style={{ flex: 4, padding: '0px 0px 0px 2px' }}
                                        style={{ display: 'inline-block' }}

                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }}>Merchendise Shop</Typography>
                                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: "9px", color: 'orange' }}>105 Collections</Typography> */}
                                    </div>
                                    <ExploreOutlinedIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                            }


                            {market ?
                                <Link to="/market" className="nav-tab borders active" style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <div
                                        // style={{ flex: 4, padding: '0px 0px 0px 2px' }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }}>Market</Typography>
                                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: "9px", color: 'orange' }}>105 Collections</Typography> */}
                                    </div>
                                    <StoreIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                                :
                                <Link to="/market" className="nav-tab borders" style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex', color: 'white' }}>
                                    <div
                                        // style={{ flex: 4, padding: '0px 0px 0px 2px' }}
                                        style={{ display: 'inline-block' }}

                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: "16px", }}>Market</Typography>
                                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: "9px", color: 'orange' }}>105 Collections</Typography> */}
                                    </div>
                                    <StoreIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                                </Link>
                            }

                            {/* <div className="nav-tab borders " style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', display: 'flex' }}>
                                <Typography sx={{ fontWeight: 'bold', display: 'inline-block', fontSize: "16px" }}>Resources</Typography>
                                <SourceIcon sx={{ display: 'inline-block', fontSize: "25px" }} />
                            </div> */}

                            <div className="nav-tab borders" style={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                <div style={{ borderRadius: '50%', backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '40px', height: '40px', position: 'relative', zIndex: 0 }}>
                                    <Tooltip TransitionComponent={Zoom} title={
                                        <Box sx={{
                                            width: '200px',
                                            padding: '5px'
                                        }}>
                                            {userDetails.isLoggedIn !== false ?
                                                <>
                                                    <Link style={{ color: 'white' }} to={`/creator/${userDetails.userWallet}`}>Profile</Link>
                                                    <hr></hr>
                                                    <Link style={{ color: 'white' }} to={"edit-profile"}>Edit Profile</Link>
                                                    <hr></hr>
                                                    <Link style={{ textDecoration: 'none', color: 'white' }} to="/my-collections">My collections</Link>
                                                    <hr></hr>
                                                    <Link style={{ textDecoration: 'none', color: 'white' }} to="/offers">Offers</Link>
                                                </>
                                                :
                                                <>
                                                    <Typography sx={{ fontSize: 14, cursor: 'pointer' }} onClick={() => {
                                                        handleLogin()
                                                    }}>Connect Wallet</Typography>
                                                </>
                                            }
                                        </Box>}>
                                        {user && userDetails.isLoggedIn && user.avatar_path ?
                                            <div style={{
                                                backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.avatar_path}`),
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                width: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 100,
                                                height: '100%',
                                                borderRadius: '50%',
                                                cursor: 'pointer'
                                            }}
                                            />
                                            :
                                            <AccountCircleIcon sx={{ color: '#00a6c5', fontSize: "50px", cursor: 'pointer' }} />
                                        }
                                    </Tooltip>
                                </div>
                                <div style={{ backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '5px' }}>
                                    <Tooltip TransitionComponent={Zoom} title={
                                        <Box sx={{
                                            width: '200px',
                                            padding: '5px'
                                        }}>
                                            {userDetails.isLoggedIn !== false ?
                                                <>
                                                    <Typography>{userDetails.userWallet}</Typography>
                                                    <hr></hr>
                                                    <Typography sx={{ fontSize: 14 }}>Ballance:
                                                        <span>{formatNearAmount(balance, 4)}</span>
                                                    </Typography>
                                                    <hr></hr>
                                                    {/* <Link to="/storage-withdraw" style={{ textDecoration: "none", color: "white" }}>
                                                        <Typography sx={{ fontSize: 14 }}>Storage Withdraw
                                                        </Typography>
                                                    </Link>
                                                    <hr></hr>
                                                    <Link to="/storage-deposit" style={{ color: "white", }}>
                                                        <Typography sx={{ fontSize: 14 }}>Storage Deposit
                                                        </Typography>
                                                    </Link>
                                                    <hr></hr> */}
                                                    <Typography sx={{ cursor: 'pointer' }}
                                                        onClick={() => handleLogOut()}
                                                    >
                                                        Logout <LogoutIcon sx={{ fontSize: 20, color: 'red' }} />
                                                    </Typography>
                                                </>
                                                :
                                                <>
                                                    <Typography sx={{ fontSize: 14, cursor: 'pointer' }} onClick={() => {
                                                        handleLogin()
                                                    }}>Connect Wallet</Typography>
                                                </>
                                            }
                                        </Box>}>
                                        <AccountBalanceWalletIcon sx={{ color: '#00a6c5', fontSize: "45px", cursor: 'pointer' }} />
                                    </Tooltip>
                                </div>

                            </div>
                        </Box>

                    </Box>
                </Box >

                <Box sx={{
                    display: {
                        xs: 'block', sm: 'block', md: 'none', lg: 'none'
                    },
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 2%' }}>
                        <div style={{ flex: 1 }}>
                            <Link to="/">
                                <div style={{
                                    backgroundImage: BG_URL(PUBLIC_URL(`/images/logo.svg`)),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '65px',
                                    height: '65px',
                                    display: 'inline-block',
                                    marginTop: 5,
                                }} />
                            </Link>
                        </div>
                        <Box sx={{ flex: 5 }}>
                            <div style={{ margin: '0 auto', position: 'relative', width: '70%' }}>
                                <input type="text" className="form-control" placeholder="Search" />
                                <SearchIcon className="nav-search-icon" />
                            </div>
                        </Box>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer('right', true)}
                            sx={{ flex: 1 }}
                        >
                            <MenuIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                    </Box>
                    <SwipeableDrawer
                        anchor={'right'}
                        open={state['right']}
                        onClose={toggleDrawer('right', false)}
                        onOpen={toggleDrawer('right', true)}
                    >
                        <div style={{ width: '80vw', background: '#33343f', height: '100%', position: 'relative' }}>
                            <NavMobileRow text="aqua" link="/" isSelected={false}
                                logo={
                                    <div style={{
                                        backgroundImage: BG_URL(PUBLIC_URL(`/images/logo.svg`)),
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '50px',
                                        height: '50px',
                                    }} />
                                }
                            />
                            <NavMobileRow text="Create" link="/create/collection" isSelected={create ? true : false} logo={<AddCircleOutlineOutlinedIcon sx={{ color: 'white', fontSize: "30px" }} />} />
                            <NavMobileRow text="Merchendise Shop" link="/merchendise-shop" isSelected={false} logo={<AddCircleOutlineOutlinedIcon sx={{ color: 'white', fontSize: "30px" }} />} />
                            <NavMobileRow text="Market" link="/market" isSelected={market ? true : false} logo={<StoreIcon sx={{ color: 'white', fontSize: "30px" }} />} />
                            <NavAccardeon title={"Profile"} logo={
                                <div style={{ borderRadius: '50%', backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '40px', height: '40px', position: 'relative', zIndex: 0 }}>
                                    {user && userDetails.isLoggedIn && user.avatar_path ?
                                        <div style={{
                                            backgroundImage: BG_URL(`${API_CONFIG.AUTH_API_URL}${user.avatar_path}`),
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 100,
                                            borderRadius: '50%',
                                            cursor: 'pointer'
                                        }}
                                        />
                                        :
                                        <AccountCircleIcon sx={{ color: '#00a6c5', fontSize: "50px", cursor: 'pointer' }} />}
                                </div>
                            }>
                                {userDetails.isLoggedIn !== false ?
                                    <div style={{ padding: '10px' }}>
                                        <Link style={{ width: '100%', color: 'white' }} to={`/creator/${userDetails.userWallet}`}>Profile</Link>
                                        <hr></hr>
                                        <Link style={{ width: '100%', color: 'white' }} to={"edit-profile"}>Edit Profile</Link>
                                        <hr></hr>
                                        <Link style={{ width: '100%', textDecoration: 'none', color: 'white' }} to="/my-collections">My collections</Link>
                                        <hr></hr>
                                        <Link style={{ width: '100%', textDecoration: 'none', color: 'white', paddingBottom: '20px' }} to="/offers">Offers</Link>
                                        <br></br>
                                    </div>
                                    :
                                    <div style={{ padding: '10px' }}>
                                        <Typography sx={{ color: 'white' }} onClick={() => {
                                            handleLogin()
                                        }}>Connect Wallet</Typography>
                                    </div>
                                }
                            </NavAccardeon>

                            <NavAccardeon title={"wallet"} logo={
                                <div style={{ backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '5px' }}>
                                    <AccountBalanceWalletIcon sx={{ color: '#00a6c5', fontSize: "55px", cursor: 'pointer' }} />
                                </div>
                            }>
                                {userDetails.isLoggedIn !== false ?
                                    <div style={{ padding: '10px' }}>
                                        <Typography sx={{ color: 'white' }}>{userDetails.userWallet}</Typography>
                                        <hr></hr>
                                        <Typography sx={{ color: 'white' }}>Ballance:
                                            <span>{formatNearAmount(balance, 4)}</span>
                                        </Typography>
                                        {/* <hr></hr>
                                        <Link to="/storage-withdraw" style={{ textDecoration: "none", color: "white" }}>
                                            <Typography sx={{ color: 'white' }}>Storage Withdraw
                                            </Typography>
                                        </Link>
                                        <hr></hr>
                                        <Link to="/storage-deposit" style={{ color: "white", }}>
                                            <Typography sx={{ color: 'white' }}>Storage Deposit
                                            </Typography>
                                        </Link> */}
                                    </div>
                                    :
                                    <div style={{ padding: '10px' }}>
                                        <Typography sx={{ color: 'white' }} onClick={() => {
                                            handleLogin()
                                        }}>Connect Wallet</Typography>
                                    </div>
                                }
                            </NavAccardeon>
                            {userDetails && userDetails.isLoggedIn == true ?
                                <Typography variant='h5' sx={{ color: 'red', textAlign: 'center', padding: '20px 0px', background: '#33343f' }} onClick={() => handleLogOut()}>
                                    Logout&nbsp;
                                    <LogoutIcon sx={{ fontSize: 20, color: 'red' }} />
                                </Typography>
                                :
                                <Typography variant='h5' sx={{ color: theme.pallete.lightBlue, textAlign: 'center', margin: '20px 0px' }} onClick={() => {
                                    handleLogin()
                                }}>Connect Wallet</Typography>
                            }
                            {/* <Accordion sx={{ background: '#42475a', margin: '2px 0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography sx={{ color: 'white' }}>Accordion 1</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography>Accordion 2</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disabled>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                >
                                    <Typography>Disabled Accordion</Typography>
                                </AccordionSummary>
                            </Accordion> */}
                            {/* <NavMobileRow text="aqua" link="/" />
                            {create ? <NavMobileRow logo={<AddCircleOutlineOutlinedIcon sx={{ color: 'orange', fontSize: 30 }} />} text="Create" link="/create/collection" /> : <NavMobileRow logo={<AddCircleOutlineOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />} text="Create" link="/create/collection" />}
                            {exlpore ? <NavMobileRow logo={<ExploreOutlinedIcon sx={{ color: 'orange', fontSize: 30 }} />} text="Merchendise shop" link="/merchendise-shop" /> :
                                <NavMobileRow logo={<ExploreOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />} text="Merchendise shop" link="/merchendise-shop" />}
                            <NavMobileRow logo={<StarsIcon sx={{ color: 'white', fontSize: 30 }} />} text="Ranking" subtitle="Top Collections" link="/" />
                            <NavMobileRow logo={<SourceIcon sx={{ color: 'white', fontSize: 30 }} />} text="Resources" link="/" />
                            <NavMobileRow
                                logo={
                                    <div style={{ borderRadius: '50%', backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '35px', height: '35px' }}>
                                        <Tooltip TransitionComponent={Zoom} title={
                                            <Box sx={{
                                                width: '200px',
                                                padding: '5px'
                                            }}>
                                                {userDetails.isLoggedIn !== false ?
                                                    <>
                                                        <Link style={{ color: 'white' }} to={`/creator/${userDetails.userWallet}`}>Profile</Link>
                                                        <hr></hr>
                                                        <Link style={{ color: 'white' }} to={"edit-profile"}>Edit Profile</Link>
                                                        <hr></hr>
                                                        <Link style={{ textDecoration: 'none', color: 'white' }} to="/my-collections">My collections</Link>
                                                    </>
                                                    :
                                                    <>
                                                        <Typography sx={{ fontSize: 14, cursor: 'pointer' }} onClick={() => {
                                                            handleLogin()
                                                        }}>Connect Wallet</Typography>
                                                    </>
                                                }
                                            </Box>}>
                                            <AccountCircleIcon sx={{ color: '#00a6c5', fontSize: "45px", cursor: 'pointer' }} />
                                        </Tooltip>
                                    </div>
                                }
                                text="Account"
                            />
                            <NavMobileRow
                                logo={
                                    <div style={{ borderRadius: '10%', backgroundColor: 'white', alignItems: 'center', display: 'flex', justifyContent: 'center', width: '35px', height: '35px' }}>
                                        <Tooltip TransitionComponent={Zoom} title={
                                            <Box sx={{
                                                width: '200px',
                                                padding: '5px'
                                            }}>
                                                {userDetails.isLoggedIn !== false ?
                                                    <>
                                                        <Typography>{userDetails.userWallet}</Typography>
                                                        <hr></hr>
                                                        <Typography sx={{ fontSize: 14 }}>Ballance:
                                                            <span>{formatNearAmount(balance, 4)}</span>
                                                        </Typography>
                                                        <hr></hr>
                                                        <Link to="/storage-withdraw" style={{ textDecoration: "none", color: "white" }}>
                                                            <Typography sx={{ fontSize: 14 }}>Storage Withdraw
                                                            </Typography>
                                                        </Link>
                                                        <hr></hr>
                                                        <Link to="/storage-deposit" style={{ color: "white", }}>
                                                            <Typography sx={{ fontSize: 14 }}>Storage Deposit
                                                            </Typography>
                                                        </Link>
                                                        <hr></hr>
                                                        <Typography sx={{ cursor: 'pointer' }}
                                                            onClick={() => handleLogOut()}
                                                        >
                                                            Logout <LogoutIcon sx={{ fontSize: 20, color: 'red' }} />
                                                        </Typography>
                                                    </>
                                                    :
                                                    <>
                                                        <Typography sx={{ fontSize: 14, cursor: 'pointer' }} onClick={() => {
                                                            handleLogin()
                                                        }}>Connect Wallet</Typography>
                                                    </>
                                                }
                                            </Box>}>
                                            <AccountBalanceWalletIcon sx={{ color: '#00a6c5', fontSize: "45px", cursor: 'pointer' }} />
                                        </Tooltip>
                                    </div>
                                }
                                text="My wallet"
                            />
                            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', alignItems: 'center', background: '#42475a' }}>
                                <YouTubeIcon sx={{ color: 'white', fontSize: 30 }} />
                                <TwitterIcon sx={{ color: 'white', fontSize: 30 }} />
                                <TelegramIcon sx={{ color: 'white', fontSize: 30 }} />
                                <InstagramIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box> */}
                        </div>
                    </SwipeableDrawer>
                </Box>
            </Box >
        </>
    )
}
