import React from 'react'
import { Link } from 'react-router-dom'

export default function ButtonWithLogo({ text, logo, width, height, bgColor, color, displayType, borderColor, link }) {
    return (
        <>
            {
                link ?
                    <Link to={link} style={{ background: bgColor, color: color, display: displayType ? displayType : 'block', border: `2px solid ${borderColor}`, height: height, borderRadius: '4px', width: width, padding: '10px 10px 10px 20px', cursor: 'pointer', margin: '5px' }
                    } >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <span>{text}</span>
                            <span style={{ padding: '0px 10px' }}>{logo}</span>
                        </div>
                    </Link >
                    :
                    <div style={{ background: bgColor, color: color, display: displayType ? displayType : 'block', border: `2px solid ${borderColor}`, height: height, borderRadius: '4px', width: width, padding: '10px 10px 10px 20px', cursor: 'pointer', margin: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                            <span>{text}</span>
                            <span style={{ padding: '0px 10px' }}>{logo}</span>
                        </div>
                    </div>
            }
        </>
    )
}
