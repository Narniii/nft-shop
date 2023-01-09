import { Typography } from '@mui/material'
import React from 'react'

export default function CustomTitle({ text, variant, fontWeight, isCenter, margin }) {
    return (
        <Typography variant={variant} sx={{ textAlign: isCenter ? 'center' : undefined, fontWeight: fontWeight ? fontWeight : undefined, margin: margin ? margin : undefined }}>{text}</Typography>
    )
}
