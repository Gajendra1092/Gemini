import { createContext, useState } from "react";
import PropTypes from 'prop-types';
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({children}) => {

    const[input, setInput] = useState("");
    const[recentPrompt, setRecentPrompt] = useState("");
    const[prevPrompts, setPrevPrompts] = useState([]);
    const[showResult, setShowResult] = useState(false);
    const[loading, setLoading] = useState(false);
    const[resultData, setResultData] = useState("");
    
    const onSent = async (input) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
       
        const response = await run(input).catch(error => {
            console.error("Error fetching response:", error);
            setLoading(false);
            return ""; 
        });

    
        // Process response
        let responseArray = response.split("**");
        let newResponse = "";
        newResponse = responseArray.map((part, i) =>
            i % 2 === 1 ? `<b>${part}</b>` : part
        ).join("");
        let a = newResponse.split(/\d+/); // seperate if any number present
        let number = 1;
        let b = a.map((part, i) => i !== 0 ? `</br></br>${number++}${part}` : part).join("");
        let newResponse2 = b.split("*").join("</br></br>");
        let newResponseArray = newResponse2.trim().split(/\s+/);
    

        // Display typing effect
        const delayPara = (index, nextWord) => {
            setTimeout(() => {
                setResultData(prev => prev + nextWord);
            }, 40 * index);
        };
    
        newResponseArray.forEach((nextWord, i) => {
            delayPara(i, nextWord + " ");
        });

        setLoading(false);
        setInput("");
    };
    

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        input,
        setInput
    }

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContextProvider