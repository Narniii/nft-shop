import { Box } from '@mui/material'
import React from 'react'
import LanguageIcon from '@mui/icons-material/Language';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { PUBLIC_URL } from '../../../utils/utils';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        color: 'white',
        fontSize: 12,
    },
}));

export default function SocialRow({ links }) {
    return (
        <Box className='links-row' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
            {links && links.website ?
                <LightTooltip title="Website" placement="top" arrow>
                    <a href={links.website} target="_blank">
                        <LanguageIcon />
                    </a>
                </LightTooltip>
                : undefined}
            {links && links.discord ?
                <LightTooltip title="Discord" placement="top" arrow>
                    <a href={links.discord} target="_blank">
                        <img src={PUBLIC_URL('images/social/discord.svg')} style={{ width: '26px' }} />
                    </a>
                </LightTooltip>
                : undefined}
            {links && links.telegram ?
                <LightTooltip title="Telegram" placement="top" arrow>
                    <a href={links.telegram} target="_blank">
                        <TelegramIcon />
                    </a>
                </LightTooltip>
                : undefined}
            {links && links.instagram ?
                <LightTooltip title="Instagram" placement="top" arrow>
                    <a href={links.instagram} target="_blank">
                        <InstagramIcon />
                    </a>
                </LightTooltip>
                : undefined}
        </Box>
    )
}
