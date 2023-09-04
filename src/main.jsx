import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'globalThis';
import ChatWidget from "./ChatWidgetV1";
// import './fonts/ADPortsGroup/ADPortsGroup-Regular.otf';
// import './fonts/ADPortsGroup/ADPortsGroup-Light.otf';
// import './fonts/ADPortsGroup/ADPortsGroup-Bold.otf';

ReactDOM.createRoot(document.getElementById('crmroot')).render(
  <React.StrictMode>
    <App />    
    {/* <ChatWidget /> */}
  </React.StrictMode>,
)
