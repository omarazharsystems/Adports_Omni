/**
 * React component that renders a live chat widget.
 * 
 * Props:
 * - isEng (boolean): Determines whether the chat widget should be rendered in English or not.
 * - loggeinUserDetails (object): Contains the logged-in user's details, such as their first name, last name, phone number, and email address.
 * 
 * Example Usage:
 * <ChatWidgetV1 isEng={true} loggeinUserDetails={userDetails} />
 * 
 * This component initializes the chat SDK, sets up the chat configuration, and handles various events and user interactions. It also includes customizations for the chat widget's appearance and behavior.
 * 
 * Flow:
 * 1. Initializes state variables using the useState hook.
 * 2. Calls the init function when the component mounts, which initializes the chat SDK and sets up the chat configuration.
 * 3. Calls the RenderPreChatSurvey function to retrieve and render the pre-chat survey.
 * 4. Determines the appropriate widget ID based on the isEng prop and whether the user is logged in or not.
 * 5. Returns the chat configuration object.
 * 6. Calls the init function with the appropriate language data (English or Arabic) to initialize the chat widget.
 * 7. Calls the handleQuickButtonClicked function when the user clicks on the upload button, allowing them to select and upload a file attachment.
 * 8. Creates a telemetry handler for logging chat events.
 * 9. Creates a custom logger for logging chat events to the console.
 * 10. Extracts the website URL and user details to be used as the initial custom context for the chat.
 * 11. Renders the LiveChatWidget component with the appropriate props, including the chat SDK, chat configuration, and customizations for the chat widget's appearance and behavior.
 * 
 * Outputs:
 * - Renders the live chat widget with the specified language and user details.
 * - Allows users to interact with the chat interface, send messages, upload files, and receive responses from the chat agent.
 * - Handles various events and user interactions, such as initializing the chat SDK, rendering the pre-chat survey, and logging telemetry events.
 * - Can be customized with different styles, buttons, and behaviors based on the provided props and configuration.
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */

import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";
import { LiveChatWidget } from "@microsoft/omnichannel-chat-widget";
import { useEffect, useState } from "react";
import { IconButton } from "@fluentui/react";
import configData from "./config";
import langAr from "./lang/lang.ar";
import langEN from "./lang/lang.en";
import LogLevel from "@microsoft/omnichannel-chat-sdk/lib/telemetry/LogLevel";
import UiData from "./uiConfig";

const parseAdaptiveCardPayload = (payload, langData) => {
  if (payload && payload !== "{}") {
    try {
      const parsedPayload = payload;
      const body = parsedPayload.body;
      if (body) {
        for (const fields of body) {
          if (
            fields.type == "TextBlock" &&
            fields.text.includes("Country Code")
          ) {
            fields.isVisible = false;
          }

          if (fields.id && fields.id.includes(":")) {
            const parsedId = JSON.parse(fields.id);
            fields.id = parsedId.Id;
            fields.isRequired = parsedId.IsRequired ?? false;
            if (parsedId.Name == "Email") {
              fields.regex = "^[\\w\\.-]+@[a-zA-Z\\d\\.-]+\\.[a-zA-Z]{2,}$";
              // "(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
              fields.errorMessage = langData.errorMessageEmail;
            }

            if (parsedId.Name == "Phone") {
              // With dash -
              fields.regex =
                "^\\d{1}(\\d{1}|\\d{0})(\\d{1}|\\d{0})\\-(\\d{5}|\\d{6}|\\d{7}|\\d{8}|\\d{9}|\\d{10}|\\d{11}|\\d{12}|\\d{13})$";
              //without dash -
              // fields.regex =  "^\\+\\d{1}(\\d{1}|\\d{0})(\\d{1}|\\d{0})(\\d{7}|\\d{9})$";
              fields.errorMessage = langData.errorMessagePhone;
            }

            if (parsedId.Name == "FirstName") {
              fields.regex = "^[\\u0600-\\u06FF\\sA-Za-zs]{1,35}$";
              fields.errorMessage = langData.errorMessageFname;
            }

            if (parsedId.Name == "LastName") {
              fields.regex = "^[\\u0600-\\u06FF\\sA-Za-zs]{1,35}$";
              // /$/
              fields.errorMessage = langData.errorMessageLname;
            }

            if (parsedId.Name == "CountryCode") {
              fields.isVisible = false;
              fields.isRequired = false;
            }

            // console.log('parsedId.Name', );
            // isVisible CountryCode
            // if (
            //   fields.isRequired &&
            //   parsedId.Name != "Email" &&
            //   parsedId.Name != "Phone"
            // ) {
            //   fields.errorMessage = requiredFieldMissingMessage.replace(
            //     "{0}",
            //     parsedId.Name ?? ""
            //   );
            // }
          }
        }
      }
      // console.log("parsedPayload", parsedPayload);
      return JSON.stringify(parsedPayload);
    } catch (ex) {
      throw new Error(`Adaptive card pase error: ${ex}`);
    }
  }
  return payload;
};

// eslint-disable-next-line react/prop-types
const ChatWidgetV1 = ({ isEng, loggeinUserDetails }) => {
  // console.log("loggeinUserDetailsloggeinUserDetails:", loggeinUserDetails);
  const [liveChatWidgetProps, setLiveChatWidgetProps] = useState(null);
  const [ChatSkdCustom, setChatSkdCustom] = useState(null);
  const [langData, setLangData] = useState(null);
  const [inititalContaxt, setInitialContaxt] = useState(null);
  const [test, setTest] = useState(true);

  // ***
  const [ChatHeight, setChatHeight] = useState("55px");
  const [ChatWidth, setChatWidth] = useState("55px");

  // eslint-disable-next-line no-unused-vars
  const handleQuickButtonClicked = (value) => {
    // console.log("[handleQuickButtonClicked]", value);
    const fileSelector = document.createElement("input");
    fileSelector.setAttribute("type", "file");
    fileSelector.click();
    fileSelector.onchange = async (event) => {
      const file = event.target.files[0];
      liveChatWidgetProps.chatSDK?.uploadFileAttachment(file);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        // addUserMessage(`![attachment](${fileReader.result})`);
      };
    };
  };

  // ***
  const getWidgetId = () => {
    if (loggeinUserDetails) {
      return isEng
        ? configData.widgetId_EN_logged_in
        : configData.widgetId_AR_logged_in;
    } else {
      return isEng ? configData.widgetId_EN : configData.widgetId_AR;
    }
  };

  const getOmnichannelChatConfig = () => {
    const omnichannelConfig = {
      orgId: configData.orgId,
      orgUrl: configData.orgUrl,
      widgetId: getWidgetId(), // ***
    };

    return omnichannelConfig;
  };

  const init = async (langData) => {
    const omnichannelConfig = getOmnichannelChatConfig();
    const chatSDK = new OmnichannelChatSDK(omnichannelConfig);

    await chatSDK.initialize();
    const chatConfig = await chatSDK.getLiveChatConfig();
    RenderPreChatSurvey(chatSDK);

    const chatButtonProps = {
      componentOverrides: {
        iconContainer: logoIcon,
      },
      controlProps: {
        titleText: langData.title,
        subtitleText: langData.subtitle,
      },
    };

    const liveChatWidgetProps = {
      styleProps: {
        generalStyles: {
          width: "350px",
          height: "550px",
          bottom: "30px",
       
              "*,:after,:before": {
              boxSizing: "unset",
             }, 
          position: 'unset',
          [isEng ? "right" : "left"]: "12px",
        }},
      // ***
      confirmationPaneProps: {
        generalStyleProps:{
          fontFamily: UiData.sitFontFamily
        },
        styleProps: {
          confirmButtonStyleProps: {
            backgroundColor: UiData.confirmButtonBackgroundColor,
          },
          confirmButtonHoveredStyleProps: {
            backgroundColor: UiData.confirmButtonHoveredBackgroundColor,
          },
        },
        controlProps: {
          confirmButtonText: langData.confirmButtonText,
          cancelButtonText: langData.cancelButtonText,
        },
        confirmationPaneLocalizedTexts: {
          CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_EMAIL_AND_DOWNLOAD_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_EMAIL_AND_DOWNLOAD_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_EMAIL_AND_DOWNLOAD_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_EMAIL_AND_DOWNLOAD_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_EMAIL_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_EMAIL_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_EMAIL_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_EMAIL_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_DOWNLOAD_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_TITLE_FOR_DOWNLOAD_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_DOWNLOAD_TRANSCRIPT_ENABLED:
            langData.CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_FOR_DOWNLOAD_TRANSCRIPT_ENABLED,
          CLOSE_CONFIRMATION_DIALOG_TITLE_DEFAULT:
            langData.CLOSE_CONFIRMATION_DIALOG_TITLE_DEFAULT,
          CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_DEFAULT:
            langData.CLOSE_CONFIRMATION_DIALOG_DESCRIPTION_DEFAULT,
        },
      },
      postChatLoadingPaneProps:{
        controlProps:{
          subtitleText: langData.postChatLoadingPanePropsSubtitleText
        }
      },
      loadingPaneProps: {
        styleProps: {
          spinnerStyleProps: {
            color: UiData.loadingPaneSpinnerColor,
          },
          generalStyleProps: {
            backgroundColor: UiData.loadingPaneSpinnerBackgroundColor,
          },
          titleStyleProps: { fontFamily: UiData.sitFontFamily },
          subtitleStyleProps: { fontFamily: UiData.sitFontFamily },
          spinnerTextStyleProps: { fontFamily: UiData.sitFontFamily },
        },
        controlProps: {
          titleText: langData.titleText,
          subtitleText: langData.subtitleText,
          spinnerText: langData.spinnerText,
        },
      },
      headerProps: {
        styleProps: {
          generalStyleProps: {
            background: UiData.headerBackground,
            boxSizing: "border-box !important",
          },
        },
        componentOverrides: {
          headerIcon: logoHeaderIcon,
          headerTitle: HaderTitle(langData.title),
        },
      },
      // chatButtonProps: isEng
      //   ? chatButtonProps
      //   : {
      //       styleProps: {
      //         generalStyleProps: {
      //           right: 200,
      //         },
      //       },
      //       ...chatButtonProps,
      //     },
      chatSDK,
      chatConfig,
      webChatContainerProps: {
        // disableMarkdownMessageFormatting: false, //setting the default to true for a known issue with markdown
      },
    };

   
    setLiveChatWidgetProps(liveChatWidgetProps);
  };

  const RenderPreChatSurvey = async (ChatSkdCustom) => {
    const chatSDK = ChatSkdCustom;
    const preChatSurvey = await chatSDK.getPreChatSurvey();
    setChatSkdCustom(preChatSurvey);
  };

  const buttonStyleProps = {
    root: {
      color: "blue",
      height: 25,
      width: 25,
    },
  };

  const createWebChatTelemetry = () => {
    let isInitEventLogged = false;
 
    const handleTelemetry = (event) => {
      const { level, name } = event;
      const loglevel = level ? level.toUpperCase() : "";

      if (name?.toLowerCase() === "init" && isInitEventLogged) return;

      switch (loglevel) {
        case LogLevel.DEBUG:
          // console.log("CUSTOM WEB LOG",LogLevel.DEBUG, event);
          // TelemetryHelper.logWebChatEvent(LogLevel.DEBUG, event);
          break;
        case LogLevel.WARN:
          // TelemetryHelper.logWebChatEvent(LogLevel.WARN, event);
          // console.log("CUSTOM WEB LOG",LogLevel.WARN, event);
          break;
        case LogLevel.ERROR:
          // TelemetryHelper.logWebChatEvent(LogLevel.ERROR, event);
          // console.log("CUSTOM WEB LOG",LogLevel.ERROR, event);
          break;
        case LogLevel.INFO:
        default:
          // TelemetryHelper.logWebChatEvent(LogLevel.INFO, event);
          // console.log("CUSTOM WEB LOG",LogLevel.INFO, event);
          break;
      }

      if (name?.toLowerCase() === "init") {
        isInitEventLogged = true;
      }
    };

    return handleTelemetry;
  };

  const customConsoleLogger = () => {
    const customConsoleLogger = {
      log: (logLevel, telemetryInput) => {
        const payload =
          telemetryInput?.payload &&
          Object.keys(telemetryInput?.payload).length > 0
            ? telemetryInput?.payload
            : "";
        const telemetryInfo =
          telemetryInput?.telemetryInfo &&
          Object.keys(telemetryInput?.telemetryInfo).length > 0
            ? telemetryInput?.telemetryInfo
            : "";
        try {
          switch (logLevel) {
            case LogLevel.INFO:
              if (payload?.Event == "LCWChatButtonClicked") {
                setChatHeight("75vh");
                setChatWidth("360px");
              }

              if (payload?.Event == "LCWChatButtonShow") {
                setChatHeight("55px");
                setChatWidth("55px");
              }

              if (
                payload?.Event == "ConfirmationConfirmButtonClicked" ||
                payload?.Event == "ConversationEndedThreadEventReceived" ||
                payload?.Event == "EndChatSDKCall" ||
                payload?.Event == "PostChatSurveyLoadingPaneLoaded"
              ) {
                setTest(false);
              }

              if (
                payload?.Event == "WidgetLoadComplete" ||
                payload?.Event == "WebChatLoaded" ||
                payload?.Event == "LoadingPaneLoaded"
              ) {
                setTest(true);
              }
              console.info(
                "Custom-Logger INFO:",
                payload?.Event,
                telemetryInfo
              );
              break;
            case LogLevel.DEBUG:
              console.debug(
                "Custom-Logger DEBUG:",
                payload.Event,
                telemetryInfo
              );
              break;
            case LogLevel.WARN:
              console.warn("Custom-Logger WARN:", payload.Event, telemetryInfo);
              break;
            case LogLevel.ERROR:
              console.error("Custom-Logger ERROR:", payload.Event);
              break;
            default:
              console.debug(
                "Custom-Logger debug:",
                payload?.Event,
                telemetryInfo
              );
              break;
          }
        } catch (ex) {
          // console.error(
          //   "An unexpected error occurred in the Telemetry client: " + ex
          // );
        }
      },
    };
    return customConsoleLogger;
  };

  const calendarIcon = { iconName: "Calendar" };
  const calendarIconButton = (
    <IconButton
      key="calendarIconButton"
      iconProps={calendarIcon}
      styles={buttonStyleProps}
      title="Calendar"
    ></IconButton>
  );

  const emojiIcon = { iconName: "Emoji2" };
  const emojiIconButton = (
    <IconButton
      key="emojiIconButton"
      iconProps={emojiIcon}
      styles={buttonStyleProps}
      title="Sentiment"
    ></IconButton>
  );

  const uploadIcon = { iconName: "Attach" };
  const uploadIconButton = (
    <IconButton
      key="uploadIconButton"
      iconProps={uploadIcon}
      onClick={handleQuickButtonClicked}
      styles={buttonStyleProps}
      title="Upload"
    ></IconButton>
  );

  const logoIcon = (
    <i
      aria-hidden="true"
      style={{
        backgroundImage: `url("${UiData.Logo_URL}")`,
        display: "flex",
        backgroundPosition: `center center`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `65% 65%`,
        borderColor: `transparent`,
        borderRadius: `50%`,
        borderStyle: `solid`,
        borderWidth: `1px`,
        justifyContent: `center`,
        margin: `-2px -2px -2px -3px`,
        border: "2px solid white",
        height: "34px",
        width: "34px",
        position: "relative",
        alignItems: "center",
      }}
      className="root-111"
      id="oc-lcw-chat-button-icon-container"
    ></i>
  );

  const logoHeaderIcon = (
    <i
      aria-hidden="true"
      style={{
        backgroundImage: `url("${UiData.Logo_URL}")`,
        backgroundPosition: `center center`,
        backgroundRepeat: `no-repeat`,
        backgroundSize: `65% 65%`,
        height: `50px`,
        margin: `-2px -2px -2px -3px`,
        width: `50px`,
      }}
      className="root-111"
      id="oc-lcw-chat-button-icon-container"
    ></i>
  );

  const HaderTitle = (title) => (
    <label id="lcw-header-title" style={{ color: "#ffffff" }} tabIndex="-1">
      {title}
    </label>
  );

  const customizedFooterProp = {
    controlProps: {
      leftGroup: { children: [uploadIconButton] },
      middleGroup: { children: [calendarIconButton] },
      rightGroup: { children: [emojiIconButton] },
    },
  };

  const contextProvider = () => {
    var URL = window.location.href;
    var matches = URL.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/);
    var host = matches && matches[1];
    var segments = host ? host.split(".") : "URL not found";
    var websitename = segments
      ? segments.slice(1, segments.length - 1).join(".")
      : "URL not found";
    // var middle = segments.slice(1, segments.length - 1).join(".");
    // console.log('middle', middle, segments);

    let contextValues = {};
    if (loggeinUserDetails) {
      contextValues = {
        FirstName: {
          value: loggeinUserDetails?.data?.firstName[isEng ? "en-US" : "ar-AE"],
          isDisplayable: true,
        },
        LastName: {
          value: loggeinUserDetails?.data?.lastName[isEng ? "en-US" : "ar-AE"],
          isDisplayable: true,
        },
        Phone: {
          value: loggeinUserDetails?.data?.mobileNumber,
          isDisplayable: true,
        },
        Email: {
          value: loggeinUserDetails?.data?.emailAddress,
          isDisplayable: true,
        },
        CountryCode: {
          value: loggeinUserDetails?.data?.mobileNumberCode,
          isDisplayable: true,
        },
        URL: {
          value: websitename,
          isDisplayable: true,
        },
      };
    } else {
      contextValues = { URL: { value: websitename, isDisplayable: true } };
    }

    setInitialContaxt(contextValues);
    return;
  };

  useEffect(() => {
    let langData;
    setLiveChatWidgetProps(null);
    if (isEng) {
      setLangData(langEN);
      langData = langEN;
    } else {
      setLangData(langAr);
      langData = langAr;
    }
    init(langData);
  }, [isEng]);

  useEffect(() => {
    contextProvider();
    return async () => {
      liveChatWidgetProps && (await liveChatWidgetProps.chatSDK.endChat());
    };
  }, []);

  return (
    <>
      {liveChatWidgetProps && (
        <LiveChatWidget
          {...liveChatWidgetProps}
          chatButtonProps={{
            // Overides the default logo
            componentOverrides: {
              iconContainer: logoIcon,
            },
            controlProps: {
              hideChatTextContainer: true,
              hideChatSubtitle: true,
              hideChatTitle: true,
            },
            styleProps: {
              generalStyleProps: {
                background: UiData.chatButtonBackground,
                borderRadius: "100px 100px 100px 99px",
                borderStyle: undefined,
                bottom: "0px",
                padding: "8px",
                boxShadow: "0 0 4px rgb(102 102 102 / 50%)",
                cursor: "pointer",
                display: "flex",
                height: undefined,
                margin: "3px 3px 3px 3px",
                position: "absolute",
                right: "0px",
                selectors: {
                  ":hover": {
                    background: UiData.chatButtonHoverBackground,
                  },
                  ":focus": {
                    // outline: undefined,
                    outline: "solid 2px transparent",
                  },
                },
                minWidth: "0px",
              },
            },
          }}
          // styleProps={{
          //   generalStyles: {
          //     // height: ChatHeight,
          //     // width: ChatWidth,
          //     bottom: "30px",
          //     "*,:after,:before": {
          //       boxSizing: "unset",
          //     }, 
          //     // height: "550px", // Default height
          //     // "@media (max-width: 768px)": {
          //     //   height: "450px", // Adjust the height for smaller screens
          //     // },
          //     // "@media (max-width: 480px)": {
          //     //   height: "400px", // Adjust the height for even smaller screens
          //     // },
          //     // position: "unset", ***
          //     // width: "350px",
          //     // height: "550px",
          //     [isEng ? "right" : "left"]: "12px", // original was 12px ***
          //   },
          // }}
          preChatSurveyPaneProps={{
            styleProps: {
              customButtonStyleProps: {
                fontFamily: UiData.sitFontFamily,
                backgroundColor: UiData.submitButtonColor,
              },
              customTextInputStyleProps: {
                fontSize: "14px",
                fontFamily: UiData.sitFontFamily,
              },
            },
            controlProps: {
              payload: parseAdaptiveCardPayload(ChatSkdCustom, langData),
            },
          }}
          footerProps={{
            controlProps: {
              // leftGroup: test ? { children: [uploadIconButton] } : null,
              hideDownloadTranscriptButton: true,
              hideEmailTranscriptButton: true,
              hideAudioNotificationButton: !test,
            },
          }}
          webChatContainerProps={{
            renderingMiddlewareProps: {
              userMessageStyleProps: { fontFamily: UiData.sitFontFamily },
              systemMessageStyleProps: { fontFamily: UiData.sitFontFamily },
              userMessageBoxStyles: { fontFamily: UiData.sitFontFamily },
              systemMessageBoxStyles: { fontFamily: UiData.sitFontFamily },
              typingIndicatorStyleProps: { fontFamily: UiData.sitFontFamily },
              typingIndicatorBubbleStyleProps: { fontFamily: UiData.sitFontFamily },
              typingIndicatorMessageStyleProps: { fontFamily: UiData.sitFontFamily },
              avatarStyleProps: { 
                fontFamily: UiData.sitFontFamily,
                backgroundColor: UiData.submitButtonColor
               },
              avatarTextStyleProps: { fontFamily: UiData.sitFontFamily },
              timestampContentStyleProps: { fontFamily: UiData.sitFontFamily },
              timestampFailedTextStyleProps: { fontFamily: UiData.sitFontFamily },
              timestampRetryTextStyleProps: { fontFamily: UiData.sitFontFamily },
              attachmentDividerStyles: { fontFamily: UiData.sitFontFamily },
              attachmentStyles: { fontFamily: UiData.sitFontFamily },
              attachmentIconStyles: { fontFamily: UiData.sitFontFamily },
              attachmentAdaptiveCardStyles: { fontFamily: UiData.sitFontFamily },
              attachmentFileNameStyles: { fontFamily: UiData.sitFontFamily },
              attachmentDownloadIconStyles: { fontFamily: UiData.sitFontFamily },
              attachmentContentStyles: { fontFamily: UiData.sitFontFamily },
              attachmentSizeStyles: { fontFamily: UiData.sitFontFamily },
              receivedMessageAnchorStyles: { fontFamily: UiData.sitFontFamily },
              sentMessageAnchorStyles: { fontFamily: UiData.sitFontFamily },
            },
            webChatStyles: {
              textAlign: "initial",
              hideUploadButton: false,
              primaryFont: UiData.sitFontFamily,
              bubbleBackground: UiData.submitButtonColor
            },
            webChatProps: {
              onTelemetry: createWebChatTelemetry(),
            },
          }}
          initialCustomContext={inititalContaxt}
          telemetryConfig={{
            telemetryLoggers: [customConsoleLogger()],
            disableConsoleLog: true,
          }}
        ></LiveChatWidget>

    
      )}
    </>
  );
};

export default ChatWidgetV1;

// is ko 1st file me krna hy but can be done in others
// var extractPreChatSurveyResponseValues = (preChatSurvey, values) => {
//   if (preChatSurvey && preChatSurvey !== "{}" && values) {
//     try {
//       let countryCOdeValTOAsigne = "";
//       const parsedSurvey = JSON.parse(preChatSurvey);
//       const body = parsedSurvey.body;
//       const type6 = {
//         "Type": Constants.InputSubmit
//       };
//       const computedValues = [];
//       for (const val of values) {
//         const index = val.index;
//         const Id = body[index].id;

//         const name = JSON.parse(Id).Name;
//           if(name == 'Phone'){
//             const pValue = val.value;
//             const myArray = pValue.split("-");
//             countryCOdeValTOAsigne = myArray[0];
//             const modifiedPhoneV = pValue.replace("-", '');
//             computedValues[Id] = modifiedPhoneV;
//           } else if(name == 'CountryCode'){
//             computedValues[Id] = countryCOdeValTOAsigne;
//           } else {
//             computedValues[Id] = val.value;
//           }

//       }
//       const finalPayload = {
//         ...type6,
//         ...computedValues
//       };
//       return finalPayload;
//     } catch (ex) {
//       throw new Error(`PreChatSurvey Response parse error: ${ex}`);
//     }
//   }
//   return {};
// };
// extractPreChatSurveyResponseValues @microsoft_omnichannel-chat-widget.js

// SEARCH BY  initialStateFromCache = JSON.parse(initialState)
// ye wala sara uthana hy and replace in all files *
// const okok = {
//   ...initialStateFromCache,
//   appStates:{...initialStateFromCache.appStates, isMinimized: false},
// }
// return okok;

/// TextArea inpute limit 6000 char - Chat widget text area after submisssion - search node modules and change it
