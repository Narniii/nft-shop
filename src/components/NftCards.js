import { Box, Paper, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NftCards({ bgImage, image, title, description, creator, creatorLink, link }) {
    const theme = useTheme()
    return (
        <Paper elevation={5} sx={{ margin: 2, height: "400px", borderTopRightRadius: 5, borderTopLeftRadius: 5, backgroundColor: theme.pallete.lightBox }}>
            <Link to={link}>
                <Box sx={{
                    backgroundImage: bgImage,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: 150,
                    borderTopRightRadius: 5,
                    borderTopLeftRadius: 5,
                    position: 'relative'
                }}>
                    <Box sx={{
                        backgroundImage: image,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        width: 60,
                        height: 60,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                        position: 'absolute',
                        bottom: -30,
                        left: '50%',
                        borderRadius: '50%',
                        transform: 'translate(-50%, 0)',
                    }}></Box>
                </Box>
                <Typography sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '30px', color: 'black' }}>{title}</Typography>
                <Typography sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '5px', marginBottom: '10px', fontSize: '12px', color: 'black' }}>By <Link style={{ color: theme.pallete.lightBlue }} to={creatorLink}>{creator}</Link></Typography>
                <Box sx={{ width: '90%', height: '150px', margin: '0 auto' }}>
                    <Typography sx={{ color: 'white', display: 'flex', flexWrap: 'wrap', height: '100%' }}>{description}</Typography>
                </Box>
            </Link>
        </Paper >
    )
}
