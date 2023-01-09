import { Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';

export default function NearCallBack() {
    const search = useLocation().search;
    const account_id = new URLSearchParams(search).get('account_id');
    const transactionHashes = new URLSearchParams(search).get('transactionHashes');
    const origin = new URLSearchParams(search).get('origin');
    const message = new URLSearchParams(search).get('message').replace(/-/g, ' ')
    console.log(origin)
    return (
        <>
            {/* <div>NearCallBack</div> */}
            <div className='container' style={{ paddingTop: "10vh", paddingBottom: "10vh" , minHeight:"40vh"}}>
                <h4 style={{color:'green'}}>
                    {message}
                </h4>
                {message.includes("wrong") && origin.includes("deposit") ? <Typography sx={{ display: 'inline-block', verticalAlign: 'sub', color: '#999a9f' }}><Link to="/storage-deposit">try again</Link></Typography> : undefined}
                {message.includes("wrong") && origin.includes("withdraw") ? <Typography sx={{ display: 'inline-block', verticalAlign: 'sub', color: '#999a9f' }}><Link to="/storage-withraw">try again</Link></Typography> : undefined}
            </div>
        </>
    )
}
