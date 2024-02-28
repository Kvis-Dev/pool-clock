import {useEffect, useMemo, useRef, useState} from "react";
import {translations} from "../translation";
import {strings as enStrings} from "../translation/en";
import {KeyValue} from "../translation/types";


export function useEventListener(eventName: string, handler: (event: Event) => void, element = window) {
    const savedHandler = useRef();
    useEffect(() => {
        // @ts-ignore
        savedHandler.current = handler;
    }, [handler]);

    useEffect(
        () => {
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;
            // @ts-ignore
            const eventListener = (event: any) => savedHandler.current(event);
            element.addEventListener(eventName, eventListener);
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element]
    );
}

type LngKeys = keyof typeof enStrings

type LanguageType = {
    [key in LngKeys]: string
}
export const useLanguage = (lng: 'en' | 'ua'): LanguageType => {
    let [lngStrings, setLngStrings] = useState<KeyValue>({})
    let strings = {...translations["en"]}

    useMemo(
        () => {
            strings = {...translations["en"]}
            for (let k in translations[lng]) {
                // @ts-ignore
                if (translations[lng][k]) {
                    // @ts-ignore
                    strings[k] = translations[lng][k]
                }
            }

            setLngStrings(strings)
            lngStrings = strings
        },
        [lng]
    );

    return lngStrings as LanguageType;
}