import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import { LiveChatWidget } from "@microsoft/omnichannel-chat-widget";
import React, { useEffect, useState } from "react";

const getOmnichannelChatConfig = () => {
    // add your own OC setting, hard-coded just for sample, should be replaced with a better handling
    const omnichannelConfig = { 
      orgId: "85007ef2-3740-40f7-99c4-385ec02041ea", // dummy config
      orgUrl: "https://d74b6a9ace5c43408eb05789f931ca-crm15.omnichannelengagementhub.com", // dummy config
      widgetId: "551b5707-0748-4a63-8eee-7b41bfbd3b95", // dummy config
    };
    return omnichannelConfig;
}

export default App = () => {
    const [liveChatWidgetProps, setLiveChatWidgetProps] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const omnichannelConfig = getOmnichannelChatConfig();

            const chatSDK = new OmnichannelChatSDK(omnichannelConfig);
            await chatSDK.initialize();
            const chatConfig = await chatSDK.getLiveChatConfig();

            const liveChatWidgetProps = {
                styleProps: {
                    generalStyles: {
                        width: "400px",
                        height: "600px",
                        bottom: "30px",
                        right: "30px"
                    }
                },
                chatSDK,
                chatConfig,
                webChatContainerProps:{
                    disableMarkdownMessageFormatting : false //setting the default to true for a known issue with markdown
                }
            };

            setLiveChatWidgetProps(liveChatWidgetProps);
        }

        init();
    }, []);

    return (
        <div>
            {liveChatWidgetProps && <LiveChatWidget {...liveChatWidgetProps} />}
        </div>
    );
};

