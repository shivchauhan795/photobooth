import { createContext, useContext, useState } from "react";
const stateContexts = createContext();



export const StateContext = ({ children }) => {
    const [screenshots, setScreenshots] = useState([]);
    const [photoToBeSent, setPhotoToBeSent] = useState([]);
    const [urls, seturls] = useState([]);
    return (
        <stateContexts.Provider value={{ screenshots, setScreenshots, photoToBeSent, setPhotoToBeSent, urls, seturls }}>
            {children}
        </stateContexts.Provider>
    );
};
export const stateContext = () => useContext(stateContexts);