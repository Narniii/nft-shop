import React from 'react'
import { PUBLIC_URL, BG_URL } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
export default function NoMatch() {
    return (
        <section>
            <Box sx={{ margin: '5% auto' }} >
                <Typography variant='h2' sx={{ textAlign: 'center', color: '#b93434', fontWeight: 'bold' }}>The requested page could not be found.</Typography>
                <div className='text-center'>
                    <img src={PUBLIC_URL('images/blockchainerror.svg')} alt="404" style={{ width: '25%', margin: '70px 0px' }} />
                    <Link to="/" >
                        <Typography variant='h4' sx={{ color: '#64c5ba', fontWeight: 'bold' }}>Back to home</Typography>
                    </Link>
                </div>
            </Box>
        </section >
    )
}
