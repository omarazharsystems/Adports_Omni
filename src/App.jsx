import { useState, useEffect } from "react";
import ChatWidget from "./ChatWidgetV1";
import UiData from "./uiConfig";
// import {analytics} from './analytics'
// import "./App.css"
// import TagManager from "react-gtm-module";
import { initializeGTM, pushGTMEvent } from './GTMSetup';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [AuthUserData, setAuthUserData] = useState();
  const [isSessionCHecked, setIsSesionCHecked] = useState(false);

  // GTM Implementation
  useEffect(() => {
    // console.log("This is my wish: ", UiData)
    initializeGTM(UiData?.GTM_ID)
    const eventData = {
      someKey: 'someValue',
      anotherKey: 'anotherValue',
    };
    pushGTMEvent('custom_event_name', eventData);
    // ID is coming from uiConfig -> staging.atlp.ae -> index.ts (aka UiData)
   // Check if GTM_ID exists in UiData
  // if (UiData?.GTM_ID) {
  //   // Initialize Google Tag Manager
  //   TagManager.initialize({ gtmId: UiData.GTM_ID });
  // }
    // analytics(window, document, 'script', 'dataLayer', `${UiData?.GTM}`);
  }, []);

  useEffect(() => {
    // document.documentElement.lang = 'kib';

    const handleLoad = () => {
      setIsLoading(false);
      checkSession();
    };

    if (document.readyState === "complete") {
      setIsLoading(false);
      checkSession();
    } else {
      document.addEventListener("readystatechange", handleLoad);
    }

    return () => {
      document.removeEventListener("readystatechange", handleLoad);
    };
  }, []);

  const checkSession = async () => {
    const isDataAuth = await sessionStorage.getItem("USER_DETAILS");
    if (isDataAuth) {
      let loggeinUserDetails = JSON.parse(isDataAuth);
      if (loggeinUserDetails && loggeinUserDetails?.success) {
        setAuthUserData(loggeinUserDetails);
        setIsSesionCHecked(true);
      } else {
        setAuthUserData(null);
        setIsSesionCHecked(true);
      }
    } else {
      setAuthUserData(null);
      setIsSesionCHecked(true);
    }
  };

  if (isLoading || !isSessionCHecked) {
    return null;
  }

  return (
    <>
      <style>
        {/* button[aria-label="Submit"] {
            background: ${UiData.buttonSubmitBackground} 
          }  

          button[aria-label="‏‏إرسال"] {
            background: ${UiData.buttonSubmitBackground}  
          } */}

        {`
          .ac-input.ac-textInput {
            border-radius:6px;  
          }

          .ac-input.ac-textInput {
            border-radius:6px;  
          }

          .ac-input.ac-textInput:hover {
            border: 1px solid #6F4C98;
          }

          .ac-input.ac-textInput:focus-visible { 
            outline: #6F4C98 1px !important;
            border-color: #6F4C98 !important;
            box-shadow: 0px 0px 0px 2px #DBD7E8 !important;
          }


          button[aria-label="Minimize"]:hover {
            color: ${UiData.buttonMinimizeColor} ;
            background-color: ${UiData.buttonMinimizeBackgroundColor} ;
          }
          
          div.ac-textBlock {
              color: ${UiData.textBlockColor};
              font-family: ${UiData.sitFontFamily} !important;
          }
          
          .ac-input.ac-textInput {
              border: 1px solid ${UiData.acTextInputBorderColor};
          }

          .webchat__keyboard-help__sub-header {
            display: none;
          }

          .webchat__keyboard-help__header {
            display: none;
          }
          
        `}
      </style>
      <div
        style={{
          fontFamily: UiData.sitFontFamily,
          fontSize: "14px",
          position: "absolute",
          bottom: "75px",
          [document.documentElement.lang == "en" ? "right" : "left"]: "12px", // Original 12px: intended to remove the whit-space margin on right side
        }}
      >
        <ChatWidget
          loggeinUserDetails={AuthUserData}
          isEng={document.documentElement.lang == "en"}
        />
      </div>
    </>
  );
}

export default App;
