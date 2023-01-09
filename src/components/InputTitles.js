import { Typography } from '@mui/material'
import React from 'react'

export default function InputTitles({ title, titleColor, variant, isBold, margin, marginTop, explanation, isRequired }) {
    return (
        <div style={{ overFlow: 'hidden', margin: margin ? margin : '10px 0px', marginTop: marginTop ? marginTop : "inherit" }}>
            <Typography variant={variant} sx={{ verticalAlign: 'sub', color: titleColor ? titleColor : undefined, display: 'inline-block', fontWeight: isBold ? 'bold' : undefined }}>{title}</Typography>
            {isRequired ?
                <div style={{ display: 'inline-block', color: '#1593b2', fontSize: 50, verticalAlign: 'top', height: '30px' }}>*</div>
                : undefined
            }
            {explanation ? <Typography sx={{ color: '#999a9f', margin: '10px 0px' }}> {explanation}</Typography> : undefined}

        </div >
    )
}
