import { darkColors } from "../../theme/colors";

export interface NavThemeType {
  background: string;
}

export const light: NavThemeType = {
  background: "#eaeaea",
};

export const dark: NavThemeType = {
  background: darkColors.backgroundAlt,
};
