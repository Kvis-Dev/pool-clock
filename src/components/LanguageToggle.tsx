import React from "react";

export function LanguageToggle({settings, saveSettings}: { settings: any, saveSettings: any }) {
    const toggleLanguage = () => {
        const newLanguage = settings.language === 'en' ? 'ua' : 'en'
        saveSettings({...settings, language: newLanguage})
    }

    return (
        <div className="language-toggle" onClick={toggleLanguage}
             style={{backgroundImage: settings.language === 'en' ? 'url(./ukrainian-flag.svg)' : 'url(./english.svg)'}}
        >
        </div>
    )
}