'use client';

import React, { useState, createContext, useEffect } from 'react'

const localObj = JSON.parse(localStorage.getItem('contentObj'));

export const StorageContext = createContext(null);
export default function StorageContextProvider({ children }) {
    const [list, setList] = useState([]);
    const [activeDocumentTextContent, setActiveDocumentTextContent] = useState("");
    useEffect(() => {
        if(localObj) {
        setList(localObj)
        }
    }, [])
    return (
    <StorageContext.Provider value={{ list, setList, activeDocumentTextContent, setActiveDocumentTextContent }}>
        {children}
    </StorageContext.Provider>
    )
}
