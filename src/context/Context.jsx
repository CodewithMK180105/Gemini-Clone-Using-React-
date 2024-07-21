import React, { createContext, useState } from 'react';
import runChat from "../config/gemini";

export const Context =createContext();

const ContextProvider = (props) =>{

    const [input,setInput]=useState(""); //To Save the input data
    const [recentPrompt,setRecentPrompt]=useState(""); // To display the prompt in the main component
    const [prevPrompts,setPrevPrompts]=useState([]); // To save all the prompts as a History
    const [showResult,setShowResult]=useState(false); // For hiding the cards
    const [loading,setLoading]=useState(false); // For Loading Animation
    const [resultData,setResultData]=useState(""); // To display the result

    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat=()=>{
        setLoading(false);
        setShowResult(false);
    }

    const onSent=async(prompt)=>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt!==undefined){
            response=await runChat(prompt);
            setRecentPrompt(prompt);
        }
        else{
            setPrevPrompts(prev=>[...prev,input]);
            setRecentPrompt(input);
            response=await runChat(input);
        }
        const responseArray = response.split('**');
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 1) {
                newResponse += "<b>" + responseArray[i] + "</b>";
            } else {
                newResponse += responseArray[i];
            }
        }
        let newResponse2=newResponse.split("*").join("</br>");
        let newResponseArray=newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const nextWord=newResponseArray[i];
            delayPara(i,nextWord+" ");
        }
        setResultData(newResponse2);
        setLoading(false);
        setInput("");
    }

    
    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider

