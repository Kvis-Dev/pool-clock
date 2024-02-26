import React, {useEffect, useState} from 'react';
import './App.css';
import {HashRouter, Link, Route, Routes,} from "react-router-dom";
import {useEventListener} from "./hooks/hooks";
import beep from './audio/beep.mp3'
import buzz from './audio/buzz.mp3'
import useSound from 'use-sound'
import {loadSettings, Settings} from "./Settings";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


function PlayerInfo({player, active}: { player: any, active: boolean }) {
    return (
        <>
            <div className={`arrow-wrapper arrow-wrapper-${active}`}>
                {active && (<div className="arrow arrow-top"></div>)}
            </div>

            <div className={`player-info player-info-active-${active}`}>
                <p className="name">Player: {player.name}</p>
                <p className={'score'}>{player.score}</p>
                <p className={`extension extension-${player.extension} extension-requested-${player.extensionRequested}`}>Extension</p>
            </div>

            <div className="arrow-wrapper">
                {active && (<div className="arrow arrow-bottom"></div>)}
            </div>
        </>
    )
}

function Timer({timeLeft, clock, timeIsRunning}: { timeLeft: number, clock: number, timeIsRunning: boolean }) {
    const percentage = (timeLeft / clock) * 100
    const width = percentage + '%'
    const bgColorCss = timeIsRunning ? {backgroundColor: calcColor(percentage)} : {}

    return (
        <div className={'timer-wrapper'}>
            <div className={'timer'} style={{...bgColorCss, 'width': timeIsRunning ? width : '100%'}}/>
            <div className="timer-clock">
                {timeIsRunning ? timeLeft : <>&nbsp;</>}
            </div>
        </div>
    )
}

function GamePool() {
    const settings = loadSettings()

    const defaultPlayersState = [{
        'name': settings.player1Name,
        'extension': true,
        'extensionRequested': false,
        'score': 0,
    }, {
        'name': settings.player2Name,
        'extension': true,
        'extensionRequested': false,
        'score': 0,
    }]

    const [playSoundBuzz] = useSound(buzz)
    const [playSoundBeep] = useSound(beep)

    const [isPlayingFirsShot, setIsPlayingFirsShot] = useState(true)
    const [timeLeft, setTimeLeft] = useState(settings.firstTimeForShot)
    const [timeIsRunning, setTimeIsRunning] = useState(false)
    const [player, setPlayer] = useState(0)
    const [players, setPlayers] = useState(defaultPlayersState)

    let interval: any = null

    const currentShotClock = isPlayingFirsShot ? settings.firstTimeForShot : settings.timeForShot

    const removeExtensionRequest = () => {
        setPlayers((players) => {
            players[0].extensionRequested = false
            players[1].extensionRequested = false
            return [...players]
        })
    }
    const makeAllExtensionsAvailable = () => {
        setPlayers((players) => {
            players[0].extension = true
            players[1].extension = true
            return [...players]
        })
    }
    const defaultStartStopAction = () => {
        if (timeIsRunning) {
            setTimeIsRunning(false)
            removeExtensionRequest()
            if (players[player].extensionRequested) {
                setPlayers((players) => {
                    players[player].extension = false
                    return [...players]
                })
            }
            setIsPlayingFirsShot(false)
        } else {
            if (isPlayingFirsShot) {
                setTimeLeft(isPlayingFirsShot ? settings.firstTimeForShot : settings.timeForShot)
            } else {
                setTimeLeft(settings.timeForShot)
            }
            setTimeIsRunning(true)
        }
    }
    const nextPlayerAction = () => {
        if (!timeIsRunning) {
            setPlayer((player) => {
                return player === 0 ? 1 : 0
            })
        } else {
            toast.info("You can't change current player while time is running!");
        }
    }
    const extensionAction = () => {
        if (players[player].extension) {
            setPlayers((players) => {
                players[player].extensionRequested = true
                return [...players]
            })
        } else {
            toast.info("Extension unavailable!");
        }
    }

    useEventListener('keydown', ({key}: { key: any; }) => {
        switch (key) {
            case ' ':
                defaultStartStopAction()
                break
            case 'n':
                nextPlayerAction()
                break
            case 's':
                setTimeIsRunning(true)
                break
            case '1':
                setIsPlayingFirsShot(true)
                break
            case 'e':
                extensionAction()
                break
            case 'k':
                setTimeIsRunning(false)
                setTimeLeft(settings.firstTimeForShot)
                makeAllExtensionsAvailable()
                removeExtensionRequest()
                setIsPlayingFirsShot(true)
                setPlayers((players) => {
                    players[player].score++
                    return [...players]
                })
                break

            case 'ArrowRight':
            case 'ArrowLeft':
                if (!timeIsRunning) {
                    setPlayer((player) => {
                        return player === 0 ? 1 : 0
                    })
                } else {
                    toast.info("You can't change current player while time is running!");
                }
                break
            case 'ArrowUp':
                if (!timeIsRunning) {
                    setPlayers((players) => {
                        players[player].score++
                        return [...players]
                    })
                } else {
                    toast.info("You can't change score while time is running!");
                }
                break
            case 'ArrowDown':
                if (!timeIsRunning) {
                    setPlayers((players) => {
                            players[player].score--
                            return [...players]
                        }
                    )
                } else {
                    toast.info("You can't change score while time is running!");
                }
                break
        }
    });

    useEffect(() => {
        interval = setInterval(() => {
            setTimeLeft((timeLeft) => {
                if (timeIsRunning) {
                    timeLeft--;
                    if (timeLeft <= 0) {
                        if ((settings.automaticExtension && players[player].extension) || (players[player].extensionRequested && players[player].extension)) {
                            timeLeft = currentShotClock
                            setPlayers((players) => {
                                players[player].extension = false
                                return [...players]
                            })
                            removeExtensionRequest()
                        } else {
                            playSoundBuzz()
                            setTimeIsRunning(false)
                        }
                    }
                }
                return timeLeft
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            interval = null;
        };
    }, [timeIsRunning, players, player, timeLeft]);


    useEffect(() => {
        if (timeLeft > 0 && timeLeft < 6 && !players[player].extensionRequested) {
            playSoundBeep()
        }
    }, [timeLeft, playSoundBeep])

    return (
        <div className="info-display">
            <div className="legend">
                <span>N - next player</span>
                <span>E - extension</span>
                <span>1 - first shot</span>
                <span>K - end of rack</span>
                <span>Space - hit</span>
            </div>

            <div className={'players'}>
                <div className={'player player1'}>
                    <PlayerInfo player={players[0]} active={player === 0}/>
                </div>
                <div className="race-to-info">Race to: {settings.raceTo}</div>
                <div className={'player player2'}>
                    <PlayerInfo player={players[1]} active={player === 1}/>
                </div>
            </div>

            <div className={'clock'}>
                <Timer timeIsRunning={timeIsRunning} timeLeft={timeLeft} clock={currentShotClock}/>
            </div>

        </div>
    )
}


function App() {
    return (<>
            <HashRouter>
                <Routes>
                    <Route path="/pool" element={<GamePool/>}/>
                    <Route path="/" element={<Settings/>}/>
                </Routes>
            </HashRouter>
            <ToastContainer position="bottom-right" autoClose={3000}/>
        </>
    );
}

export default App;
