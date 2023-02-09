import { darkColors } from "../../theme/colors";

export interface NavThemeType {
  background: string;
}

export const light: NavThemeType = {
  background: "#f1f1f1",
};

export const dark: NavThemeType = {
  background: darkColors.backgroundAlt,
};
