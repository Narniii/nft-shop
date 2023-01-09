import React, { useEffect, useLayoutEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material';
// NOTE:if you want to use text you should use font size instead of width and height
// element types can be text(thin line) circular rectangular(box shape) rounded(box with border radius)
export default function LoadingComponent({ isGrid, ColNumber, responsiveColNumber, elementType, elementWidth, elementHeight, responsiveElementWidth, responsiveElementHeight, fontSize, elementCount, responsiveCount }) {
    const theme = useTheme()
    let views = []
    let responsiveViews = []
    const [isMobile, setIsMobile] = useState(undefined)
    useLayoutEffect(() => {
        function updateSize() {
            if (window.innerWidth > 768) setIsMobile(false)
            else setIsMobile(true)
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);



    if (!isGrid)
        return <Skeleton variant={elementType} sx={elementType === "text" ? { fontSize: fontSize } : { width: elementWidth, height: elementHeight }} />
    switch (ColNumber) {
        case 4:
            if (responsiveColNumber == 1) {
                if (isMobile) {
                    for (var a = 0; a < responsiveCount; a++) {
                        responsiveViews.push(
                            <div className='col-12' key={a}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var b = 0; b < elementCount; b++) {
                        views.push(
                            <div className='col-md-3' key={b}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            if (responsiveColNumber == 2) {
                if (isMobile) {
                    for (var c = 0; c < responsiveCount; c++) {
                        responsiveViews.push(
                            <div className='col-6' key={c}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var j = 0; j < elementCount; j++) {
                        views.push(
                            <div className='col-md-3' key={j}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            if (responsiveColNumber == 3) {
                if (isMobile) {
                    for (var d = 0; d < responsiveCount; d++) {
                        responsiveViews.push(
                            <div className='col-4' key={d}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var e = 0; e < elementCount; e++) {
                        views.push(
                            <div className='col-md-3' key={e}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            break;
        case 3:
            if (responsiveColNumber == 1) {
                if (isMobile) {
                    for (var f = 0; f < responsiveCount; f++) {
                        responsiveViews.push(
                            <div className='col-12' key={f}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var g = 0; g < elementCount; g++) {
                        views.push(
                            <div className='col-md-4' key={g}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            if (responsiveColNumber == 2) {
                if (isMobile) {
                    for (var h = 0; h < responsiveCount; h++) {
                        responsiveViews.push(
                            <div className='col-6' key={h}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var i = 0; i < elementCount; i++) {
                        views.push(
                            <div className='col-md-4' key={i}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            if (responsiveColNumber == 3) {
                if (isMobile) {
                    for (var j = 0; j < responsiveCount; j++) {
                        responsiveViews.push(
                            <div className='col-4' key={j}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var k = 0; k < elementCount; k++) {
                        views.push(
                            <div className='col-md-4' key={k}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            break;
        case 2:
            if (responsiveColNumber == 1) {
                if (isMobile) {
                    for (var l = 0; l < responsiveCount; l++) {
                        responsiveViews.push(
                            <div className='col-12' key={l}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var m = 0; m < elementCount; m++) {
                        views.push(
                            <div className='col-md-6' key={m}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
            if (responsiveColNumber == 2) {
                if (isMobile) {
                    for (var n = 0; n < responsiveCount; n++) {
                        responsiveViews.push(
                            <div className='col-6' key={n}><Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={responsiveElementWidth} height={responsiveElementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {responsiveViews}
                    </div>
                }
                if (!isMobile) {
                    for (var o = 0; o < elementCount; o++) {
                        views.push(
                            <div className='col-md-4' key={o}>
                                <Skeleton sx={{ backgroundColor: theme.pallete.lightBox, margin: "10px 0px" }} variant={elementType} width={elementWidth} height={elementHeight} />
                            </div>
                        )
                    }
                    return <div className='row'>
                        {views}
                    </div>
                }
            }
        default:
            break;
    }
}
