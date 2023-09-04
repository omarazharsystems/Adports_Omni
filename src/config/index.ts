import devConfig from './config.dev';
import prodConfig from './config.prod';

let config;

// if (process.env.NODE_ENV === 'production') {
//   config = prodConfig;
// } else {
//   config = devConfig;
// }

config = {
    ...prodConfig,
    Logo_URL: "https://staging.atlp.ae/-/jssmedia/project/atlp/atlp-informational-web/data/media/img/Icons/atlp-live-chat.png?rev=-1",
};

export default config;