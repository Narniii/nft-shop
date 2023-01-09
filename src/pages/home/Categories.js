import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import CustomTitle from '../../components/CustomTitle'
import CardWithBordersAndBgColor from '../../components/CardWithBordersAndBgColor'
import { BG_URL, PUBLIC_URL } from '../../utils/utils'
import { category } from './category'
import { Link } from "react-router-dom";

export default function Categories() {
    return (
        <div className='container'>
            <CustomTitle variant='h1' isCenter={true} fontWeight='bold' text="Browse by category" margin="50px 0px" />
            <Box sx={{ margin: '50px 0px' }}>
                <div className='row'>
                    {category.map((category, index) => {
                        return <div className='col-12 col-md-6 col-lg-4' key={index}>
                            <Link to={`/categories/${category.name}`} style={{ textDecoration: "none", color: "whitesmoke" }}>
                                <CardWithBordersAndBgColor boxShadow='0px 0px 15px 2px rgba(0, 0, 0, 0.9)' padding="10px">
                                    <div style={{
                                        backgroundImage: BG_URL(PUBLIC_URL(category.image)),
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        height: '140px',
                                        borderRadius: '10px',
                                    }}>
                                    </div>
                                    <div style={{ backgroundColor: '#434658', border: '2px solid #676977', width: '80%', margin: '10px auto', padding: '10px 20px', textAlign: 'center', borderRadius: '10px' }}>{category.name}</div>
                                </CardWithBordersAndBgColor>
                            </Link>
                        </div>
                    })}
                </div>
            </Box >
        </div >
    )
}
