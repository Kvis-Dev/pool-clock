import React from "react";


function calcColor(percentage: number) {
    if (percentage > 0 && percentage < 25) {
        return '#a41818'
    } else if (percentage > 24 && percentage < 50) {
        return '#87581c';
    } else if (percentage > 49 && percentage < 75) {
        return '#997815';
    } else if (percentage > 74 && percentage < 90) {
        return '#7ba01c';
    } else if (percentage > 89) {
        return '#3a8d24';
    }
}


export function Timer({timeLeft, clock, timeIsRunning}: { timeLeft: number, clock: number, timeIsRunning: boolean }) {
    const percentage = (timeLeft / clock) * 100
    const width = percentage + '%'
    const bgColorCss = timeIsRunning ? {backgroundColor: calcColor(percentage)} : {}

    return (
        <div className={'clock'}>
            <div className={'timer-wrapper'}>
                <div className={'timer'} style={{...bgColorCss, 'width': timeIsRunning ? width : '100%'}}/>
                <div className={`timer-clock timer-clock-running-${timeIsRunning}`}>
                    {timeIsRunning ? timeLeft : <>{timeLeft}</>}
                </div>
            </div>
        </div>
    )
}