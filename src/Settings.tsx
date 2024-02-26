import React, {useRef, useState} from "react";
import {Link} from "react-router-dom";


interface Settings {
    timeForShot: number
    firstTimeForShot: number,
    automaticExtension: boolean,
    player1Name: string,
    player2Name: string,
    raceTo: number
}

export function loadSettings(): Settings {
    const localStorageSettings = localStorage.getItem('settings')
    const defaults = {
        timeForShot: 30,
        firstTimeForShot: 60,
        automaticExtension: false,
        player1Name: 'Player 1',
        player2Name: 'Player 2',
        raceTo: 5
    }
    if (!localStorageSettings) {
        return defaults
    }
    const settings = JSON.parse(localStorageSettings)

    for (const key in defaults) {
        if (settings[key] === undefined || settings[key] === '') {
            // @ts-ignore
            settings[key] = defaults[key]
        }
    }

    return settings
}

export function saveSettings(settings: Settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
}

export function Settings() {
    const settings = loadSettings()

    const [formState, setFormState] = useState(settings)
    const formRef = useRef(null);

    const extractForm = (form: HTMLFormElement) => {
        const timeForShot = form.timeForShot.value
        const firstTimeForShot = form.firstTimeForShot.value
        const automaticExtension = form.automaticExtension.checked
        const player1Name = form.player1Name.value
        const player2Name = form.player2Name.value
        const raceTo = form.raceTo.value

        return {
            timeForShot,
            firstTimeForShot,
            automaticExtension,
            player1Name,
            player2Name,
            raceTo,
        }
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!formRef.current) {
            return
        }
        const settings = extractForm(formRef.current)
        setFormState(settings)
        saveSettings(settings)
    }

    return (
        <>
            <div>
                <h1>Settings</h1>
            </div>
            <form ref={formRef}>
                <label> Time for shot </label>
                <input onChange={onChangeHandler} type="number" min={10} max={600} value={settings.timeForShot}
                       name="timeForShot"/>

                <label> Time for first shot </label>
                <input onChange={onChangeHandler} type="number" min={10} max={600} value={settings.firstTimeForShot}
                       name="firstTimeForShot"/>

                <label> Automatic extension
                    <input onChange={onChangeHandler} type="checkbox" name="automaticExtension"
                           checked={settings.automaticExtension}/>
                </label>

                <label> Player 1 Name </label>
                <input onChange={onChangeHandler} type="text" value={settings.player1Name}
                       name="player1Name"/>

                <label> Player 2 Name </label>
                <input onChange={onChangeHandler} type="text" value={settings.player2Name}
                       name="player2Name"/>

                <label> Race to </label>
                <input onChange={onChangeHandler} type="number" min={1} max={100} value={settings.raceTo}
                          name="raceTo"/>

            </form>
            <div className="start-game">
                <Link className="button" to={'/pool'}>Let's go!</Link>
            </div>

        </>
    )
}