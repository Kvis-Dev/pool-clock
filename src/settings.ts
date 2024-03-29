import {determineDefaultLng} from "./helpers";
import {useState} from "react";

export interface Settings {
    timeForShot: number
    firstTimeForShot: number,
    automaticExtension: boolean,
    player1Name: string,
    player2Name: string,
    raceTo: number,
    language: 'en' | 'ua'
}

export function loadSettings(): Settings {
    const localStorageSettings = localStorage.getItem('settings')
    const defaults = {
        timeForShot: 30,
        firstTimeForShot: 60,
        automaticExtension: false,
        player1Name: 'Player 1',
        player2Name: 'Player 2',
        raceTo: 5,
        language: determineDefaultLng()
    }

    if (!localStorageSettings) {
        return <Settings>defaults
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


export function useSettings(): [Settings, (settings: Settings) => void] {
    const settings = loadSettings()
    const [settingsState, setSettingsState] = useState<Settings>(settings)
    const saveSettings = (newSettings: Settings) => {
        setSettingsState({...newSettings})
        localStorage.setItem('settings', JSON.stringify(newSettings));
    }
    return [settingsState, saveSettings]
}