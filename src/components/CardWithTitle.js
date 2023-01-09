import { Box, Typography } from '@mui/material'
import React from 'react'

export default function CardWithTitle({ title, children, marginTop, width, fontSize, responsiveFontSize, height }) {
    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: '#434658',
            border: '2px solid #696b79',
            margin: '10px auto',
            marginTop: marginTop ? marginTop : '30px',
            padding: '30px 5px 5px 5px',
            borderRadius: '10px',
            width: width ? width : '100%',
            fontSize: fontSize ? { xs: responsiveFontSize ? responsiveFontSize : fontSize, md: fontSize } : "12px",
            height: height ? height : undefined
        }}>
            {children}
            <div style={{
                position: 'absolute',
                background: '#434658',
                border: '2px solid #696b79',
                top: '-20px',
                left: '50%',
                width: '80%',
                transform: 'translate(-50%, 0)',
                textAlign: 'center',
                padding: '5px',
                borderRadius: '10px',
                fontSize: '12px'
            }}> <Typography sx={{ fontSize: { md: '12px', lg: '12px' } }}> {title}</Typography></div >
        </Box >
    )
}
