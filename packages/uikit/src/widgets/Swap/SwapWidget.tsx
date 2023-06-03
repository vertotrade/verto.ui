import { ButtonProps, IconButton } from "../../components/Button";
import { ArrowDownIcon, ArrowUpDownIcon } from "../../components/Svg";
import { switchButtonClass, iconDownClass, iconUpDownClass } from "./SwapWidget.css";
import { CurrencyInputPanel } from "./CurrencyInputPanel";
import { CurrencyInputHeader, CurrencyInputHeaderSubTitle, CurrencyInputHeaderTitle } from "./CurrencyInputHeader";
import { SwapPage } from "./Page";
import { SwapFooter } from "./Footer";
import { SwapInfo, SwapInfoLabel } from "./SwapInfo";
import { TradePrice } from "./TradePrice";

const SwapSwitchButton = (props: ButtonProps) => (
  <IconButton className={switchButtonClass} variant="vertoPrimary" style={{ height: "32px", width: "32px" }} {...props}>
    <ArrowDownIcon className={iconDownClass} />
    <ArrowUpDownIcon className={iconUpDownClass} />
  </IconButton>
);

const Swap = {
  SwitchButton: SwapSwitchButton,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  CurrencyInputHeader,
  CurrencyInputPanel,
  Page: SwapPage,
  Footer: SwapFooter,
  Info: SwapInfo,
  InfoLabel: SwapInfoLabel,
  TradePrice,
};

export { Swap };
