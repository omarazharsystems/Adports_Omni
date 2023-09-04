import { useState, useEffect } from "react";
import "./App.css";
import ChatWidget from "./ChatWidgetV1";

function App() {

  const [IsDisable, setIsDisable] = useState(false);
  const [IsLoaded, setIsLoaded] = useState(false);
  const [lang, setLang] = useState('en');
 
  useEffect(() => {
    const getLang = sessionStorage.getItem('selectedLanguage');
    const curretnLang = getLang ? getLang : 'en'
    document.documentElement.lang = curretnLang;
    setLang(curretnLang);
    setIsLoaded(true);
  }, []);

  const changeLanguage = (language) => {
    setIsDisable(true);
    setLang(language)
    document.documentElement.lang = language;
    sessionStorage.setItem('selectedLanguage', language);
    window.location.reload();
  };

  return (
    <>
      {IsLoaded && <ChatWidget isEng={lang == 'en'} />}
      <button disabled={IsDisable} onClick={() => changeLanguage(lang == 'en' ? 'ar' : 'en') }>
        Set {lang == 'en' ? 'ar' : 'en'}
      </button>
    </>
  );
}

export default App;
