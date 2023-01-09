import React from 'react'
import {
    useTheme,
} from "@mui/material/styles";
import { Box } from '@mui/system';

export default function CardWithBordersAndBgColor({ children, boxShadow, padding, width }) {
    const theme = useTheme()
    return (
        <Box sx={{
            width: width ? width : undefined,
            backgroundColor: theme.pallete.darkBox,
            border: `2px solid ${theme.pallete.lightBorder}`,
            borderRadius: '15px',
            margin: '10px 5px',
            boxShadow: boxShadow ? boxShadow : undefined,
            padding: padding ? padding : undefined,
        }}>
            {children}
        </Box>
    )
}
