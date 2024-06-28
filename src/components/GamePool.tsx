import {loadSettings} from "../settings";
import useSound from "use-sound";
import buzz from "../audio/buzz.mp3";
import beep from "../audio/beep.mp3";
import React, {useEffect, useState} from "react";
import {isThisTouchDevice} from "../helpers";
import {toast} from "react-toastify";
import {useEventListener, useLanguage} from "../hooks/hooks";
import {useSwipeable} from "react-swipeable";
import {Timer} from "./Timer";
import {PlayerInfo} from "./PlayerInfo";
import {Legend} from "./Legend";

export function GamePool() {
    const settings = loadSettings()
    const language = useLanguage(settings.language)

    const restoredScore = localStorage.getItem("score")

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
    if (restoredScore) {
        const [score1, score2] = restoredScore.split(",")
        defaultPlayersState[0].score = parseInt(score1)
        defaultPlayersState[1].score = parseInt(score2)
    }

    const [playSoundBuzz] = useSound(buzz)
    const [playSoundBeep] = useSound(beep)

    const [isPlayingFirsShot, setIsPlayingFirsShot] = useState(true)
    const [timeLeft, setTimeLeft] = useState(settings.firstTimeForShot)
    const [timeIsRunning, setTimeIsRunning] = useState(false)
    const [player, setPlayer] = useState(0)
    const [players, setPlayers] = useState(defaultPlayersState)

    const rememberScore = (players: (typeof defaultPlayersState)) => {
        localStorage.setItem("score", [players[0].score, players[1].score].join(","));
    }

    useEffect(() => {
        rememberScore(players)
    }, [players[0].score, players[1].score])

    const isTouchDevice = isThisTouchDevice()
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

            setTimeLeft(settings.timeForShot)

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
            removeExtensionRequest()
            setPlayer((player) => {
                return player === 0 ? 1 : 0
            })
        } else {
            toast.error(language.cantChangePlayer);
        }
    }
    const extensionAction = () => {
        if (players[player].extension) {
            setPlayers((players) => {
                players[player].extensionRequested = true
                return [...players]
            })
            toast.info(language.extensionApplied);
        } else {
            toast.error(language.extensionUnavailable);
        }
    }
    const arrowUpAction = () => {
        if (!timeIsRunning) {
            setPlayers((players) => {
                players[player].score++
                return [...players]
            })
        } else {
            toast.info(language.youCantChangeScore);
        }
    }
    const arrowDownAction = () => {
        if (!timeIsRunning) {
            setPlayers((players) => {
                    players[player].score--
                    return [...players]
                }
            )
        } else {
            toast.info(language.youCantChangeScore);
        }
    }
    const firstShotAction = () => {
        setIsPlayingFirsShot(true)
        setTimeLeft(settings.firstTimeForShot)
    }
    const endOfRackAction = () => {
        setTimeIsRunning(false)
        setTimeLeft(settings.firstTimeForShot)
        makeAllExtensionsAvailable()
        removeExtensionRequest()
        setIsPlayingFirsShot(true)
        setPlayers((players) => {
            players[player].score++
            return [...players]
        })
    }

    useEventListener('keydown', (event) => {
        event.stopPropagation()
        event.preventDefault()

        let key = (event as KeyboardEvent).code

        switch (key) {
            case 'Space':
                defaultStartStopAction()
                break
            case 'KeyN':
                nextPlayerAction()
                break
            case 'KeyS':
                setTimeIsRunning(true)
                break
            case 'Digit1':
                firstShotAction()
                break
            case 'Digit2':
                setIsPlayingFirsShot(false)
                setTimeLeft(settings.timeForShot)
                break
            case 'KeyE':
                extensionAction()
                break
            case 'KeyK':
                endOfRackAction()
                break
            case 'ArrowRight':
            case 'ArrowLeft':
                nextPlayerAction()
                break
            case 'ArrowUp':
                arrowUpAction()
                break
            case 'ArrowDown':
                arrowDownAction()
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

    let rootComponentSelectors = ['html', 'body', '#root']
    useEffect(() => {
        for (let rootComponentSelector of rootComponentSelectors) {
            const item = document.querySelector(rootComponentSelector) as HTMLElement
            if (item) {
                item.style.overflow = "hidden";
            }
        }
        return () => {
            for (let rootComponentSelector of rootComponentSelectors) {
                const item = document.querySelector(rootComponentSelector) as HTMLElement
                if (item) {
                    item.style.overflow = "auto"
                }
            }
        }
    })

    const leftRightHandlers = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === 'Left' || eventData.dir === 'Right') {
                nextPlayerAction()
            }
            if (eventData.dir === 'Up') {
                arrowUpAction()
            }
            if (eventData.dir === 'Down') {
                arrowDownAction()
            }
        }
    });

    return (
        <div className="info-display" {...leftRightHandlers} onClick={() => {
            isTouchDevice && defaultStartStopAction()
        }}>
            <Legend
                onFirstShotClick={() => firstShotAction()}
                settings={settings}
                onEndOfRackClick={endOfRackAction}
                timeIsRunning={timeIsRunning} />

            <div className="players">
                <div className={'player player1'}>
                    <PlayerInfo onExtensionClick={(e: Event) => {
                        e.stopPropagation()
                        e.preventDefault()
                        extensionAction()
                    }} player={players[0]} active={player === 0}/>
                </div>
                <div className="race-to-info">{language.raceToNum.replace('{raceTo}', settings.raceTo.toString())}</div>
                <div className="player player2">
                    <PlayerInfo onExtensionClick={(e: Event) => {
                        e.stopPropagation()
                        e.preventDefault()
                        extensionAction()
                    }} player={players[1]} active={player === 1}/>
                </div>
            </div>

            <Timer timeIsRunning={timeIsRunning} timeLeft={timeLeft} clock={currentShotClock}/>
        </div>
    )
}