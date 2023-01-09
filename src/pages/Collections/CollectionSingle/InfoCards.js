import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'

export default function InfoCards({ title, content }) {
    const theme = useTheme()
    return (
        <Box sx={{
            backgroundColor: theme.pallete.darkBox,
            border: `2px solid ${theme.pallete.lightBorder}`,
            padding: '20px',
            height: '220px',
            borderRadius: '20px',
            boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, 0.9)',
            margin: '5px',
        }}>
            <Box sx={{
                position: 'relative',
                backgroundColor: theme.pallete.lightBox,
                border: `2px solid ${theme.pallete.lightBorder}`,
                margin: '0px auto',
                marginTop: '20px',
                borderRadius: '20px',
                width: '100%',
                height: '85%'
            }}>
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    {content}
                </Box>
                <Box style={{
                    position: 'absolute',
                    background: theme.pallete.darkBox,
                    border: `2px solid ${theme.pallete.lightBorder}`,
                    top: '-20px',
                    left: '50%',
                    width: '85%',
                    transform: 'translate(-50%, 0)',
                    textAlign: 'center',
                    padding: '5px',
                    borderRadius: '10px',
                }}>
                    <Typography sx={{ fontSize: { xs: '12px', lg: '16px' } }}>{title}</Typography>
                </Box>
            </Box>
        </Box >
    )
}
