import { darkColors, lightColors } from "../../theme/colors";

export type ToggleTheme = {
  handleBackground: string;
  handleBg: string;
  activeHandleBg: string;
};

export const light: ToggleTheme = {
  handleBackground: lightColors.toggleHandleBackground,
  handleBg: lightColors.newPrimary,
  activeHandleBg: lightColors.white,
};

export const dark: ToggleTheme = {
  handleBackground: darkColors.background,
  handleBg: darkColors.newPrimary,
  activeHandleBg: darkColors.black,
};
