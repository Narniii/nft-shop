import { Box, useTheme } from '@mui/material'
import React from 'react'
import './SocialLinkInput.css'
export default function SocialLinkInput({ logo, placeHolder, state, onChange, name, type }) {
    const theme = useTheme()
    return (
        <Box className='social-input-wrapper' sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: ` 1px solid ${theme.pallete.lightBorder}`,
            padding: '0.375rem 0.75rem',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#212529',
            backgroundClip: 'padding-box',
            borderRadius: '0.375rem',
            transition: '#86b7fe .1s ease-in-out,#29436e .1s ease-in-out',
            color: 'gray'
        }}>
            <Box sx={{ marginRight: '5px' }}>{logo}</Box>
            <Box>{placeHolder}</Box>
            <input autoComplete='off' name={name} value={state} onChange={onChange} type={type ? type : "text"} style={{ width: "100%", appearance: 'none', border: 'none', background: 'transparent' }} />
        </Box >
    )
}
