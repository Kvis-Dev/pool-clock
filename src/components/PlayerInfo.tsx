import React from "react";
import {useLanguage} from "../hooks/hooks";
import {loadSettings} from "../settings";

export function PlayerInfo({player, active, onExtensionClick}: { player: any, active: boolean, onExtensionClick: any }) {
    const settings = loadSettings()
    const language = useLanguage(settings.language)

    return (
        <>
            <div className={`arrow-wrapper arrow-wrapper-${active}`}>
                {active && (<div className="arrow arrow-top"></div>)}
            </div>

            <div className={`player-info player-info-active-${active}`}>
                <p className="name">{player.name}</p>
                <p className={'score'}>{player.score}</p>
                <p onClick={onExtensionClick}
                   className={`extension extension-${player.extension} extension-requested-${player.extensionRequested}`}>{language.extensionBtn}</p>
            </div>

            <div className="arrow-wrapper">
                {active && (<div className="arrow arrow-bottom"></div>)}
            </div>
        </>
    )
}