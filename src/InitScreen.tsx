import React, {useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useLanguage} from "./hooks/hooks";
import {loadSettings, saveSettings} from "./settings";


export function InitScreen() {
    const settings = loadSettings()

    const [formState, setFormState] = useState(settings)
    const language = useLanguage(settings.language)

    const formRef = useRef(null);

    const extractForm = (form: HTMLFormElement) => {
        const timeForShot = form.timeForShot.value
        const firstTimeForShot = form.firstTimeForShot.value
        const automaticExtension = form.automaticExtension.checked
        const player1Name = form.player1Name.value
        const player2Name = form.player2Name.value
        const raceTo = form.raceTo.value
        const language = form.language.value

        return {
            timeForShot,
            firstTimeForShot,
            automaticExtension,
            player1Name,
            player2Name,
            raceTo,
            language,
        }
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formRef.current) {
            return
        }
        const settings = extractForm(formRef.current)
        setFormState(settings)
        saveSettings(settings)
    }

    return (
        <div>
            <div>
                <h1>
                    {language.settings}
                </h1>
            </div>
            <form ref={formRef}>
                <label> {language.timeForShot} </label>
                <input onChange={onChangeHandler} type="number" min={10} max={600} value={settings.timeForShot}
                       name="timeForShot"/>

                <label> {language.firstTimeForShot} </label>
                <input onChange={onChangeHandler} type="number" min={10} max={600} value={settings.firstTimeForShot}
                       name="firstTimeForShot"/>

                <label>
                    {language.automaticExtension}
                    <input onChange={onChangeHandler} type="checkbox" name="automaticExtension"
                           checked={settings.automaticExtension}/>
                </label>

                <label> {language.player1Name} </label>
                <input onChange={onChangeHandler} type="text" value={settings.player1Name}
                       name="player1Name"/>

                <label> {language.player2Name} </label>
                <input onChange={onChangeHandler} type="text" value={settings.player2Name}
                       name="player2Name"/>

                <label> {language.raceTo} </label>
                <input onChange={onChangeHandler} type="number" min={1} max={100} value={settings.raceTo}
                       name="raceTo"/>

                <label> {language.language} </label>
                <select value={settings.language} name="language" onChange={onChangeHandler}>
                    <option value="en"> En</option>
                    <option value="ua"> Ua</option>
                </select>
            </form>
            <div className="start-game">
                <Link className="button" to={'/pool'}>{language.go}</Link>
            </div>
        </div>
    )
}