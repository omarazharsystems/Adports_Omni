import React, { useEffect, useState } from 'react';
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';

const ChatWidget = () => {
  const [chatSDK, setChatSDK] = useState(null);
  const [chatConfig, setChatConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChatSDK = async () => {
      const omnichannelConfig = {
        orgId: "85007ef2-3740-40f7-99c4-385ec02041ea", // dummy config
        orgUrl: "https://d74b6a9ace5c43408eb05789f931ca-crm15.omnichannelengagementhub.com", // dummy config
        widgetId: "551b5707-0748-4a63-8eee-7b41bfbd3b95", // dummy config
      };
      const sdk = new OmnichannelChatSDK(omnichannelConfig);

      try {
        await sdk.initialize();
        const config = await sdk.getLiveChatConfig();
        setChatSDK(sdk);
        setChatConfig(config);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat SDK:', error);
      }
    };

    initializeChatSDK();
  }, []);

  const handleStartChat = async () => {
    try {
      const chatToken = await chatSDK.startChat();
      console.log('Chat started. Token:', chatToken);
      // Perform additional actions or navigate to chat screen
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome to the Chat Widget</h2>
      <button onClick={handleStartChat}>Start Chat</button>
    </div>
  );
};

export default ChatWidget;
