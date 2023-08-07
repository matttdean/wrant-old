'use client';

import React, { useState, createContext, useEffect, useRef } from 'react'

let localObj;
if (typeof window !== 'undefined') {
    localObj  = JSON.parse(localStorage.getItem('contentObj'));
}

export const StorageContext = createContext(null);

export default function StorageContextProvider({ children }) {
    const [list, setList] = useState([]);
    const [activeDocumentTextContent, setActiveDocumentTextContent] = useState("");
    const [isSwiping, setIsSwiping] = useState(false);
    const sideBarIsActive = useRef(true);
    useEffect(() => {
        
        if(localObj) {
        setList(localObj)
        }
    }, [])
    return (
    <StorageContext.Provider value={{ list, setList, activeDocumentTextContent, setActiveDocumentTextContent, isSwiping, setIsSwiping, sideBarIsActive }}>
        {children}
    </StorageContext.Provider>
    )
}
