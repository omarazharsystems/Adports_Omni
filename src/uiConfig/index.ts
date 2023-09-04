import stagingatlpaeData from "./staging.atlp.ae";
import admacademy2ucglabcom from "./admacademy2.ucglab.com";
import admaritime2ucglabcom from "./admaritime2.ucglab.com";
import adports2ucglabcom from "./adports2.ucglab.com";
import fujairahterminals2ucglabcom from "./fujairahterminals2.ucglab.com";
import kizad2ucglabcom from "./kizad2.ucglab.com";
import miccologistics2ucglabcom from "./miccologistics2.ucglab.com";
import safeen2ucglabcom from "./safeen2.ucglab.com";

let UiCustomConfigData;
const URLforUI = window.location.href;
const UiDomainName = URLforUI.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/);

switch (UiDomainName[1] as string) {
  case "admacademy2.ucglab.com":
    UiCustomConfigData = admacademy2ucglabcom;
    break;
  case "admaritime2.ucglab.com":
    UiCustomConfigData = admaritime2ucglabcom;
    break;
  case "adports2.ucglab.com":
    UiCustomConfigData = adports2ucglabcom;
    break;
  case "fujairahterminals2.ucglab.com":
    UiCustomConfigData = fujairahterminals2ucglabcom;
    break;
  case "kizad2.ucglab.com":
    UiCustomConfigData = kizad2ucglabcom;
    break;
  case "miccologistics2.ucglab.com":
    UiCustomConfigData = miccologistics2ucglabcom;
    break;
  case "safeen2.ucglab.com":
    UiCustomConfigData = safeen2ucglabcom;
    break;
  default:
    UiCustomConfigData = stagingatlpaeData;
}

// UiCustomConfigData = {
//   ...admaritime2ucglabcom,
// };

export default UiCustomConfigData;
