import { Typography } from '@mui/material'
import React from 'react'
import { BG_URL, PUBLIC_URL } from '../utils/utils'
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const categories = ['Art', 'Collectibles', 'Photography', 'Sports', 'Utility']
export default function Footer() {
    const userDetails = useSelector(state => state.userReducer)

    return (
        <section style={{ backgroundColor: '#434658', padding: '20px 0px' }}>
            <div className='container'>
                <div className='row'>
                    <div className='col-xs-6 col-md-4'>
                        <div className="footer-logo">
                            <Box sx={{
                                backgroundImage: BG_URL(PUBLIC_URL(`/images/logoo.svg`)),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100px',
                                height: '100px',
                                margin: { xs: '0 auto', md: 0 }
                            }} />
                            {/* <Typography variant='h5' sx={{ color: 'white', fontWeight: 'bold', margin: 1, textAlign: { xs: 'center', md: 'left' } }}>aqua</Typography> */}
                            {/* <Typography sx={{ color: 'white', margin: 1, textAlign: 'justify' }}>Join our mailing list to stay in touch with our newest feature releases, NFT drops, and tips and tricks.</Typography> */}
                        </div>
                    </div>
                    <div className='col-md-4'></div>
                    <div className='col-xs-6 col-md-4'>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: { xs: '100%', sm: '100%', lg: '80%' }, alignItems: 'center', flexDirection: 'column', height: '100%' }}>
                            <Typography variant='h5' sx={{ color: 'white', fontWeight: 'bold', margin: 1 }}>aqua Community</Typography>
                            <div className="socialmedia-icons-wrapper">
                                <a style={{ color: 'white' }} href="https://discord.gg/cS26RRFeGJ" target="_blank" rel="noreferrer">
                                    <img src={PUBLIC_URL('images/social/discord.svg')} style={{ width: '26px' }} />
                                </a>
                                <a style={{ color: 'white' }} href="https://t.me/aquadex" target="_blank" rel="noreferrer">
                                    <TelegramIcon style={{ fontSize: '30px' }} />
                                </a>
                                <a style={{ color: 'white' }} href="https://instagram.com/aquaex?utm_medium=copy_link" target="_blank" rel="noreferrer">
                                    <InstagramIcon style={{ fontSize: '30px' }} />
                                </a>
                                <a style={{ color: 'white' }} href="https://twitter.com/aquaex?s=11" target="_blank" rel="noreferrer">
                                    <TwitterIcon style={{ fontSize: '30px' }} />
                                </a>
                                <a style={{ color: 'white' }} href="https://www.youtube.com/c/aquaDEFI" target="_blank" rel="noreferrer">
                                    <YouTubeIcon style={{ fontSize: '30px' }} />
                                </a>
                                <a style={{ color: 'white' }} href="https://www.linkedin.com/company/aqua/" target="_blank" rel="noreferrer">
                                    <LinkedInIcon style={{ fontSize: '30px' }} />
                                </a>
                            </div>
                        </Box>
                    </div>
                </div>
                <div style={{ margin: '50px 0px', padding: '50px 0px', borderTop: '1px solid white', borderBottom: '1px solid white' }}>
                    <Box style={{ margin: '0px auto', width: { xs: '100%', sm: '80%' } }}>
                        <div className='row'>
                            <div className='col-4'>
                                <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Categories</Typography>
                                {categories.map((category, index) => {
                                    return <a href={`/categories/${category}`} style={{ margin: '5px 0px', fontSize: '14px', color: 'white', width: '100%', display: 'block', cursor: 'pointer', textDecoration: 'none' }} key={index}>
                                        {category}
                                    </a>
                                })}
                            </div>
                            <div className='col-4'>
                                <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Account</Typography>
                                        {userDetails.isLoggedIn ?
                                            <Link to={`/creator/${userDetails.userWallet}`} style={{ textDecoration: 'none' }}>
                                                <Typography sx={{ margin: '5px 0px', fontSize: '14px', color: "white", textDecoration: 'none', cursor: 'pointer' }}>Profile</Typography>
                                            </Link>
                                            :
                                            <Typography sx={{ margin: '5px 0px', fontSize: '14px', textDecoration: 'none' }}>Profile</Typography>
                                        }
                                    </div>
                                    <div>
                                        <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Stats</Typography>
                                        <Typography sx={{ margin: '5px 0px', fontSize: '14px' }}>Rankings</Typography>
                                    </div>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Company</Typography>
                                    <Typography sx={{ margin: '5px 0px', fontSize: '14px' }}>About</Typography>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
        </section>
    )
}
