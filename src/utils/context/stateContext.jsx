import { createContext, useContext, useState } from "react";
const stateContexts = createContext();



export const StateContext = ({ children }) => {
    const [screenshots, setScreenshots] = useState([]);
    return (
        <stateContexts.Provider value={{ screenshots, setScreenshots }}>
            {children}
        </stateContexts.Provider>
    );
};
export const stateContext = () => useContext(stateContexts);