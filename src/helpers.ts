export function isThisTouchDevice() {
    // @ts-ignore
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator?.msMaxTouchPoints > 0)
}

export function determineDefaultLng(): 'en' | 'ua' {
    const language = navigator.language.split('-')[0]
    return language === 'uk' ? 'ua' : 'en'
}