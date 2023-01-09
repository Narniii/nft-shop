import { Box } from '@mui/material'
import React from 'react'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'

export default function CommingSoon() {
    return (
        <Box sx={{
            backgroundImage: BG_URL(PUBLIC_URL('images/soon.jpg')),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '90vh',
            width: '100%'
        }} />

    )
}
