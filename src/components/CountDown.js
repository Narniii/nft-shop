import { useEffect } from "react";
import { useRef, useState } from "react";


export default function CountDown({ startTime, finishTime }) {
    var this_time = new Date(Date.now())
    const theInterval = useRef(null)
    const [count_down, setCount_down] = useState(undefined)
    const [start_time, setStart_time] = useState(parseInt(startTime))
    const [finish_time, setFinish_time] = useState(parseInt(finishTime))

    const TheCountDown = () => {
        var difference;
        var q;
        if (start_time && finish_time)
            switch (true) {
                case (this_time < new Date(start_time)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(start_time).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to start"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to start"
                    break;
                case (new Date(start_time) < this_time && this_time < new Date(finish_time)):
                    theInterval.current = setInterval(function () {
                        var thisTime = new Date(Date.now())
                        difference = Math.abs(new Date(finish_time).getTime() - thisTime.getTime()) / 1000
                        // count_down_text = Math.floor(difference / 86400) + " days and " + Math.floor(difference / 3600) % 24 + " hours and " + Math.floor(difference / 60) % 60 + " minutes to finish"
                        var days = Math.floor(difference / 86400);
                        var hours = Math.floor(difference / 3600) % 24;
                        var minutes = Math.floor(difference / 60) % 60;
                        var seconds = Math.floor(difference % 60);
                        var timerTime = days + " : " + hours + " : " + minutes + " : " + seconds;
                        setCount_down(timerTime)
                    }, 1000)
                    q = " to finish"
                    break;
                case (new Date(finish_time) < this_time):
                    setCount_down("--:--:--:--")
                    q = "expired"
                    break;
                default:
                    break;
            }
        else {
            setCount_down("--:--:--:--")
            q = ""
        }
        useEffect(() => {
            if (count_down != undefined) {
                return () => {
                    if (theInterval.current)
                        clearInterval(theInterval.current);
                };
            }
        }, [count_down])
        return (
            <>
                {count_down != undefined ?
                    <div className="col">
                        <p style={{ color: "gray" }}>{count_down}</p>
                        <p style={{ color: "gray" }}>{q}</p>
                    </div>
                    : undefined}
            </>
        )
    }

    return (
        <>
            <TheCountDown />
        </>
    );
}

